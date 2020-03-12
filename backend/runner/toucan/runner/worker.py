"""Worker logic."""
import multiprocessing as mp
import time
import os
import tempfile

from queue import Empty as QueueEmptyException

from toucan.dataclass import SubmissionToRunner

import toucan.storage

import docker

client = docker.from_env()

lang_to_image = {'python3': 'python:3.8-slim'}


def worker(queue: mp.Queue):
    while True:
        try:
            submission_to_runner = queue.get()

            execute_tests(submission_to_runner)
        except QueueEmptyException:
            time.sleep(5)
            continue


def execute_test(image: str, submission_code_abspath: str,
                 submission_code_path_basename: str, input_abspath: str,
                 memory_limit: int, wall_time_limit: int, cpu_time_limit: int):
    tmpfile, tmpfilename = tempfile.mkstemp()

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

    result = container.wait()

    print(container.logs())

    container.remove()

    print(result)


def execute_tests(submission_to_runner: SubmissionToRunner):
    try:
        container_image = lang_to_image[submission_to_runner.lang]
    except IndexError:
        print(f'{submission_to_runner.lang} isn\'t supported!')
        return

    submission_code_path = toucan.storage.download_submission_code(
        submission_to_runner.submission_id, submission_to_runner.lang)

    submission_code_path_basename = os.path.basename(submission_code_path)

    submission_code_path = os.path.abspath(submission_code_path)

    for i, input_path in enumerate(
            toucan.storage.download_inputs(submission_to_runner.test_ids)):
        execute_test(container_image,
                     submission_code_path, submission_code_path_basename,
                     os.path.abspath(input_path),
                     submission_to_runner.memory_limit,
                     submission_to_runner.wall_time_limit,
                     submission_to_runner.cpu_time_limit)
