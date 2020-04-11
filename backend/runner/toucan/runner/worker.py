"""Worker logic."""
import asyncio
import logging
import os
import tempfile
import typing

import docker

import toucan.checker
import toucan.runner.parse_time
import toucan.storage
from toucan.dataclass import ResultToChecker, SubmissionToRunner, TestResult

client = docker.from_env()

lang_to_image = {'python3': 'python:3.8-slim'}

logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


def process_submission_to_runner(
        submission_to_runner: SubmissionToRunner) -> ResultToChecker:
    """Run SubmissionToRunner and return ResultToChecker."""
    loop = asyncio.new_event_loop()

    test_results = list(
        loop.run_until_complete(execute_tests(submission_to_runner)))

    result_to_checker = ResultToChecker(submission_to_runner.submission_id,
                                        test_results)

    return result_to_checker


async def execute_test(image: str, submission_code_abspath: str,
                       submission_code_path_basename: str, input_abspath: str,
                       memory_limit: int, wall_time_limit: int,
                       cpu_time_limit: int) \
        -> typing.Callable[[int], TestResult]:
    """Execute test of submission.

    Parameters
    ----------
    image: str
        Docker image name
    submission_code_abspath: str
        Submission code absolute path
    submission_code_path_basename: str
        Submission code path basename(filename + extension)
    input_abspath: str
        Input file absolute path
    memory_limit: int
        Memory limit in megabytes
    wall_time_limit: int
        Wall(real) time limit in milliseconds
    cpu_time_limit: int
        CPU(user) time limit in milliseconds

    Returns
    -------
    _: Callable[[int], TestResult]
        Anonymous TestResult - without id
    """
    # Create temporary file for output.txt
    temporary_file_descriptor, temporary_file_path = tempfile.mkstemp()

    container = client.containers.run(
        image,
        f'bash -c "cd /usr/app;'  # Use bash and change directory
        f'time '  # Say to bash we want record execution time
        f'timeout {wall_time_limit / 1000} '  # Kill program
        # if it violates wall time limit
        #   CAPTION:
        #   it doesn't take care of CPU time limit,
        #   which is not actually a problem as
        #   we parse execution time
        # But also it doesn't care about number of threads or processes,
        # creation of which is illegal on other platforms
        f'python3 ./{submission_code_path_basename} > /dev/null"',
        network_disabled=True,  # Polite way of saying network=None
        detach=True,  # Do not wait for container to finish
        volumes={
            submission_code_abspath: {
                'bind': f'/usr/app/{submission_code_path_basename}',
                'ro': True  # read-only
            },
            input_abspath: {
                'bind': f'/usr/app/input.txt',
                'ro': True  # read-only
            },
            temporary_file_path: {
                'bind': f'/usr/app/output.txt',
                'ro': False  # read-only
            }
        },
        mem_limit=f'{memory_limit}M')

    try:
        # Wait for container to finish and get a result
        result = container.wait()

        status_code = result['StatusCode']

        logs = container.logs().decode()

        # Logs contain error stream
        # (time command output + optional error of program)
        # So we check if it matches the time command output regex
        if not toucan.runner.parse_time.check(logs):
            # Someone hacked the universe
            if status_code == 0:
                return lambda test_id: TestResult(test_id, 'UnknownError',
                                                  None, None, None)
            else:
                # Normal case
                return lambda test_id: TestResult(test_id, 'RuntimeError',
                                                  None, None, None)

        # Real(wall) time, user(cpu) time, sys(kernel) time
        real, user, _sys = toucan.runner.parse_time.parse(logs)

        # Program exited properly
        # But it doesn't mean program haven't violated CPU time limit
        # as CPU time < real time
        if status_code == 0:
            if user > cpu_time_limit:
                return lambda test_id: TestResult(test_id, 'TimeLimit',
                                                  None, None, None)

            # Read output.txt
            with os.fdopen(temporary_file_descriptor) as temporary_file:
                result = temporary_file.read()

            return lambda test_id: TestResult(test_id, 'Success', result, real,
                                              user)
        elif status_code == 137:
            # Program was killed
            # Check if it was wall time limit
            if real > wall_time_limit:
                return lambda test_id: TestResult(test_id, 'TimeLimit',
                                                  None, None, None)

            # Otherwise program was killed by container cgroup OOM killer
            # e.g. memory limit
            return lambda test_id: TestResult(test_id, 'OutOfMemory', None,
                                              None, None)
        elif status_code == 124:
            return lambda test_id: TestResult(test_id, 'TimeLimit',
                                              None, None, None)
        # In all other cases it is an RuntimeError
        return lambda test_id: TestResult(test_id, 'RuntimeError', None,
                                          None, None)
    finally:
        # Always take trash after yourself
        container.remove()


async def execute_tests(
        submission_to_runner: SubmissionToRunner
) -> list:
    """Execute all test for submission."""
    try:
        # Get docker image from language
        container_image = lang_to_image[submission_to_runner.lang]
    except IndexError:
        print(f'{submission_to_runner.lang} isn\'t supported!')
        return

    # Download submission code and get path to it
    submission_code_path = await toucan.storage.download_submission_code(
        submission_to_runner.submission_id, submission_to_runner.lang)

    logging.info(f'#{submission_to_runner.submission_id} Downloaded code')

    # Submission code basename
    submission_code_path_basename = os.path.basename(submission_code_path)

    # Submission code absolute path
    submission_code_path = os.path.abspath(submission_code_path)

    execute_result = list()
    for test_id, input_path in zip(
            submission_to_runner.test_ids,
            await toucan.storage.download_inputs(
                submission_to_runner.test_ids)):
        execute_result.append(
            (await execute_test(container_image,
                                submission_code_path,
                                submission_code_path_basename,
                                os.path.abspath(input_path),
                                submission_to_runner.memory_limit,
                                submission_to_runner.wall_time_limit,
                                submission_to_runner.cpu_time_limit))
            (test_id))

    logging.info(f'#{submission_to_runner.submission_id} Executed tests')

    return execute_result
