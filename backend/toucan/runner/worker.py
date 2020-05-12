"""Worker logic."""
import asyncio
import logging
import os
import tempfile
from concurrent.futures.thread import ThreadPoolExecutor
from queue import Queue
from typing import Any, List

import docker
from asyncpg.pool import Pool
from docker.models.volumes import Volume

import checker
import database
import storage
from dataclass import TestToWorker, TestResult
from runner import parse_time
from runner.configs import compiler_configs, runner_configs
from statistic import statistic

client = docker.from_env()

logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


def process_container_result(test_id: int, result: Any, logs, cpu_time_limit: int,
                             wall_time_limit: int, temporary_file_descriptor: int):
    """Convert container result into TestResult.

    Parameters
    ----------
    test_id: int
    result: Any
        Container result
    logs: str
    cpu_time_limit: int
    wall_time_limit: int
    temporary_file_descriptor: int
    """
    status_code = result['StatusCode']

    # Real(wall) time, user(cpu) time, sys(kernel) time
    real, user, _sys = parse_time.parse(logs)

    # Logs contain error stream
    # (time command output + optional error of program)
    # So we check if it matches the time command output regex
    if status_code in (0, 124):
        if not parse_time.check(logs):
            # Someone hacked the universe
            if status_code == 0:
                return TestResult(test_id, 'UnknownError',
                                  None, None, None)
            else:
                # Normal case
                return TestResult(test_id, 'RuntimeError',
                                  None, None, None)

    # Program exited properly
    # But it doesn't mean program haven't violated CPU time limit
    # as CPU time < real time
    if status_code == 0:
        if user > cpu_time_limit:
            return TestResult(test_id, 'TimeLimit',
                              None, None, None)

        # Read output.txt
        with os.fdopen(temporary_file_descriptor) as temporary_file:
            result = temporary_file.read()

        return TestResult(test_id, 'Success', result, real,
                          user)
    elif status_code == 137:
        # Program was killed
        # Check if it was wall time limit
        if real > wall_time_limit:
            return TestResult(test_id, 'TimeLimit',
                              None, None, None)

        # Otherwise program was killed by container cgroup OOM killer
        # e.g. memory limit
        return TestResult(test_id, 'OutOfMemory', None,
                          None, None)
    elif status_code == 124:
        return TestResult(test_id, 'TimeLimit',
                          None, None, None)
    # In all other cases it is an RuntimeError
    return TestResult(test_id, 'RuntimeError', None,
                      None, None)


async def execute_test(test_to_worker: TestToWorker, pool: Pool, volume: Volume = None):
    """Execute test.

    Parameters
    ----------
    test_to_worker: TestToWorker
    pool: Pool
        asyncpg connection pool
    volume: Volume = None
        docker volume
        is none when language isn't compilable
    """
    temporary_file_descriptor, temporary_file_path = tempfile.mkstemp(
        dir=os.getenv('LOCAL_STORAGE_ROOT') + '/temp')

    test_id = test_to_worker.test_id

    config = runner_configs[test_to_worker.lang]

    input_path = await storage.download_input(test_to_worker.test_id)
    input_abspath = os.path.abspath(input_path)

    container_volumes = {
        input_abspath: {
            'bind': '/usr/app/input.txt',
            'ro': True  # read-only
        },
        temporary_file_path: {
            'bind': '/usr/app/output.txt',
            'ro': False  # read-only
        }
    }

    if config.is_compilable:
        container_volumes[volume.name] = {
            'bind': f'/usr/app/{config.store_volume}',
            'ro': True  # read-only
        }
    else:
        container_volumes[os.path.abspath(test_to_worker.submission_code_path)] = {
            'bind': f'/usr/app/{config.file_path}',
            'ro': True  # read-only
        }

    container = client.containers.run(
        config.image,
        f'bash -c "cd /usr/app;'  # Use bash and change directory
        f'time '  # Say to bash we want record execution time
        f'timeout {test_to_worker.wall_time_limit / 1000} '  # Kill program
        # if it violates wall time limit
        #   CAPTION:
        #   it doesn't take care of CPU time limit,
        #   which is not actually a problem as
        #   we parse execution time
        # But also it doesn't care about number of threads or processes,
        # creation of which is illegal on other platforms
        f'{config.command} ./{config.file_path} > '
        f'/dev/null"',
        network_disabled=True,  # Polite way of saying network=None
        detach=True,  # Do not wait for container to finish
        volumes=container_volumes,
        mem_limit=f'{test_to_worker.memory_limit}M')

    try:
        # Wait for container to finish and get a result
        result = container.wait()

        logs = container.logs().decode()

        result = process_container_result(test_id, result, logs, test_to_worker.cpu_time_limit,
                                          test_to_worker.wall_time_limit, temporary_file_descriptor)

        logging.info(f'#{test_to_worker.submission_id} Executed {test_to_worker.test_id}')

        async with pool.acquire() as conn:
            await checker.process_test_result(result, test_to_worker.submission_id, conn)
    finally:
        container.remove()


async def update_task_bests(submission_id: int, pool: Pool):
    """Call update_task_bests from checker module.

    Parameters
    ----------
    submission_id: int
    pool: Pool
        Connection pool
    """
    async with pool.acquire() as conn:
        await statistic.update_public_task_rating(submission_id, conn)
        await checker.update_task_bests(submission_id, conn)


def worker(queue: Queue, completed_tests: dict):
    """Run worker.

    queue: Queue
        tests to execute queue
    completed_tests: dict
        Used to know when all tests for submission were executed.
    """
    loop = asyncio.new_event_loop()

    pool = loop.run_until_complete(database.establish_connection_from_env())

    while True:
        test_to_worker: TestToWorker = queue.get()

        submission_id = test_to_worker.submission_id

        loop.run_until_complete(execute_test(test_to_worker, pool, test_to_worker.volume))

        completed_tests[submission_id] -= 1

        if completed_tests[submission_id] == 0:
            loop.run_until_complete(update_task_bests(submission_id, pool))

            if test_to_worker.volume is not None:
                test_to_worker.volume.remove()

            logging.info(f'#{submission_id} Finished')


def pull_all(ignore: List[str]):
    """Pull all images specified in runner and compiler configs except listed in ignore.

    ignore: List[str]
        Ignore list
    """
    compiler_images = [compiler_configs[key].image
                       for key in compiler_configs
                       if compiler_configs[key].image is not None]

    runner_images = [runner_configs[key].image
                     for key in runner_configs
                     if runner_configs[key].image is not None]

    to_pull = filter(lambda x: x not in ignore, set(compiler_images + runner_images))

    def pull_one(image: str):
        print(f"Pulling {image}")
        client.containers.pull(image)

    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(pull_one, to_pull)

    print('Pulled all')
