"""Worker logic."""
import multiprocessing as mp
import os
import tempfile
import time
import typing
from queue import Empty as QueueEmptyException

import docker

import toucan.runner.parse_time
import toucan.storage
from toucan.dataclass import SubmissionToRunner, TestResult

client = docker.from_env()

lang_to_image = {'python3': 'python:3.8-slim'}


def worker(queue: mp.Queue):
    """Run blocking worker."""
    while True:
        try:
            submission_to_runner = queue.get()

            execute_tests(submission_to_runner)
        except QueueEmptyException:
            time.sleep(5)
            continue


def execute_test(image: str, submission_code_abspath: str,
                 submission_code_path_basename: str, input_abspath: str,
                 memory_limit: int, wall_time_limit: int,
                 cpu_time_limit: int) -> typing.Callable[[int], TestResult]:
    """Execute test for submission."""
    tmpfilefd, tmpfilename = tempfile.mkstemp()

    container = client.containers.run(
        image, f'bash -c "cd /usr/app;'
        f'time '
        f'timeout {wall_time_limit / 1000} '
        f'python3 ./{submission_code_path_basename} > /dev/null"',
        network_disabled=True,
        detach=True,
        volumes={
            submission_code_abspath: {
                'bind': f'/usr/app/{submission_code_path_basename}',
                'ro': True
            },
            input_abspath: {
                'bind': f'/usr/app/input.txt',
                'ro': True
            },
            tmpfilename: {
                'bind': f'/usr/app/output.txt',
                'ro': False
            }
        },
        mem_limit=f'{memory_limit}M')

    try:
        result = container.wait()

        status_code = result['StatusCode']

        if status_code == 0:
            logs = str(container.logs(), 'ascii')

            if not toucan.runner.parse_time.check(logs):
                return lambda test_id: TestResult(test_id, 'UnknownError',
                                                  None, None, None, None)

            real, user, _sys = toucan.runner.parse_time.parse(logs)

            if user > cpu_time_limit:
                return lambda test_id: TestResult(test_id, 'TimeLimit', None,
                                                  real, user)

            with os.fdopen(tmpfilefd) as tmpfile:
                result = tmpfile.read()

            return lambda test_id: TestResult(test_id, 'Success', result, real,
                                              user)
        elif status_code == 137:
            return lambda test_id: TestResult(test_id, 'OutOfMemory', None,
                                              None, None)
        else:
            return lambda test_id: TestResult(test_id, 'RuntimeError', None,
                                              None, None)
    finally:
        container.remove()

    print(result)


def execute_tests(submission_to_runner: SubmissionToRunner):
    """Execute all test for submission."""
    try:
        container_image = lang_to_image[submission_to_runner.lang]
    except IndexError:
        print(f'{submission_to_runner.lang} isn\'t supported!')
        return

    submission_code_path = toucan.storage.download_submission_code(
        submission_to_runner.submission_id, submission_to_runner.lang)

    submission_code_path_basename = os.path.basename(submission_code_path)

    submission_code_path = os.path.abspath(submission_code_path)

    for test_id, input_path in zip(
            submission_to_runner.test_ids,
            toucan.storage.download_inputs(submission_to_runner.test_ids)):
        print(
            execute_test(container_image, submission_code_path,
                         submission_code_path_basename,
                         os.path.abspath(input_path),
                         submission_to_runner.memory_limit,
                         submission_to_runner.wall_time_limit,
                         submission_to_runner.cpu_time_limit)(test_id))
