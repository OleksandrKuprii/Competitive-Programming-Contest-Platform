"""Worker logic."""
import asyncio
import logging
import os
import tempfile
from typing import Callable, Optional

import docker

import checker
import database
import runner.parse_time
import storage
from dataclass import ResultToChecker, SubmissionToRunner, TestResult, \
    RunnerConfig

client = docker.from_env()

runner_configs = {
    'python3': RunnerConfig('python:3.8-slim', 'python3'),
    'python2': RunnerConfig('python:2.7-slim', 'python2')
}

LOCAL_STORAGE_ROOT = os.getenv('LOCAL_STORAGE_ROOT')

assert LOCAL_STORAGE_ROOT is not None


logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


async def execute(submission_to_runner: SubmissionToRunner):
    """Execute."""
    # Creating a database pool
    pool = await database.establish_connection_from_env()

    async with pool.acquire() as conn:
        await database.change_submission_status(
            submission_to_runner.submission_id, 'Running', conn)

        test_results = list(
            await execute_tests(submission_to_runner))

        result_to_checker = ResultToChecker(submission_to_runner.submission_id,
                                            test_results)

        await checker.process_result_to_checker(result_to_checker, conn)

    # Closing the database pool
    await pool.close()


def process_submission_to_runner(
        submission_to_runner: SubmissionToRunner) -> ResultToChecker:
    """Run SubmissionToRunner and return ResultToChecker."""
    loop = asyncio.new_event_loop()
    loop.run_until_complete(execute(submission_to_runner))


async def execute_test(runner_config: RunnerConfig,
                       submission_code_abspath: str,
                       submission_code_path_basename: str, input_abspath: str,
                       memory_limit: int, wall_time_limit: int,
                       cpu_time_limit: int) \
        -> Callable[[int], TestResult]:
    """Execute test of submission.

    Parameters
    ----------
    runner_config: RunnerConfig
        The configuration of runner
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
    temporary_file_descriptor, temporary_file_path = tempfile.mkstemp(
        dir=LOCAL_STORAGE_ROOT + '/temp')

    container = client.containers.run(
        runner_config.image,
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
        f'{runner_config.command} ./{submission_code_path_basename} > '
        f'/dev/null"',
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

        # Real(wall) time, user(cpu) time, sys(kernel) time
        real, user, _sys = runner.parse_time.parse(logs)

        # Logs contain error stream
        # (time command output + optional error of program)
        # So we check if it matches the time command output regex
        if status_code in (0, 124):
            if not runner.parse_time.check(logs):
                # Someone hacked the universe
                if status_code == 0:
                    return lambda test_id: TestResult(test_id, 'UnknownError',
                                                      None, None, None)
                else:
                    # Normal case
                    return lambda test_id: TestResult(test_id, 'RuntimeError',
                                                      None, None, None)

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
) -> Optional[list]:
    """Execute all test for submission."""
    try:
        # Get runner configuration from language
        runner_config = runner_configs[submission_to_runner.lang]
    except IndexError:
        print(f'{submission_to_runner.lang} isn\'t supported!')
        return

    # Download submission code and get path to it
    submission_code_path = await storage.download_submission_code(
        submission_to_runner.submission_id, submission_to_runner.lang)

    logging.info(f'#{submission_to_runner.submission_id} Downloaded code')

    # Submission code basename
    submission_code_path_basename = os.path.basename(submission_code_path)

    # Submission code absolute path
    submission_code_path = os.path.abspath(submission_code_path)

    execute_result = list()
    for test_id, input_path in zip(
            submission_to_runner.test_ids,
            await storage.download_inputs(submission_to_runner.test_ids)):
        execute_result.append(
            (await execute_test(runner_config,
                                submission_code_path,
                                submission_code_path_basename,
                                os.path.abspath(input_path),
                                submission_to_runner.memory_limit,
                                submission_to_runner.wall_time_limit,
                                submission_to_runner.cpu_time_limit))
            (test_id))

    logging.info(f'#{submission_to_runner.submission_id} Executed tests')

    return execute_result
