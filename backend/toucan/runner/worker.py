"""Worker logic."""
import asyncio
import os
import tempfile
from queue import Queue
from typing import Optional, Any

import docker
from asyncpg.pool import Pool
from docker.models.volumes import Volume

import checker
import database
import storage
from dataclass import TestToWorker, CompilerConfig, RunnerConfig, TestResult
from runner import parse_time

client = docker.from_env()

compiler_configs = {
    'python3': CompilerConfig(is_compilable=False),
    'python2': CompilerConfig(is_compilable=False),
    'c': CompilerConfig(is_compilable=True, image='gcc:9.3.0', command='gcc',
                        args='-o compiled/compiled.out'),
    'c++': CompilerConfig(is_compilable=True, image='gcc:9.3.0', command='g++',
                          args='-o compiled/compiled.out'),
    'pascal': CompilerConfig(is_compilable=True, image='fpc',
                             command='fpc', args="-o'compiled/compiled.out'")
}

runner_configs = {
    'python3': RunnerConfig(image='python:3.8-slim', command='python',
                            is_compilable=False),
    'python2': RunnerConfig(image='python:2.7-slim', command='python',
                            is_compilable=False),
    'c': RunnerConfig(image='gcc:9.3.0', command='', is_compilable=True,
                      file_path='compiled/compiled.out'),
    'c++': RunnerConfig(image='gcc:9.3.0', command='', is_compilable=True,
                        file_path='compiled/compiled.out'),
    'pascal': RunnerConfig(image='fpc', command='',
                           is_compilable=True,
                           file_path='compiled/compiled.out')
}


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
            'bind': f'/usr/app/input.txt',
            'ro': True  # read-only
        },
        temporary_file_path: {
            'bind': f'/usr/app/output.txt',
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

        async with pool.acquire() as conn:
            await checker.process_test_result(result, test_to_worker.submission_id, conn)
    finally:
        container.remove()

        if config.is_compilable:
            volume.remove()


def compile(submission_code_path: str, config: CompilerConfig) -> Optional[Volume]:
    """Compile code.

    submission_code_path: str
    config: CompilerConfig
    """
    volume = client.volumes.create()

    submission_code_basename = os.path.basename(submission_code_path)

    container = client.containers.run(
        config.image,
        f'bash -c "cd /usr/app;'
        f'{config.command} {submission_code_basename} '
        f'{config.args}"',
        network_disabled=True,  # Polite way of saying network=None
        detach=True,  # Do not wait for container to finish
        volumes={
            os.path.abspath(submission_code_path): {
                'bind': f'/usr/app/{submission_code_basename}',
                'ro': True  # read-only
            },
            volume.name: {
                'bind': f'/usr/app/compiled',
                'ro': False  # read-only
            }
        })

    try:
        result = container.wait()

        status_code = result['StatusCode']

        if status_code != 0:
            return None

        return volume
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
        await checker.update_task_bests(submission_id, conn)


async def compilation_error(submission_id: int, pool: Pool):
    """Change submission status to CompilationError.

    Parameters
    ----------
    submission_id: int
    pool: Pool
        Connection pool
    """
    async with pool.acquire() as conn:
        await database.change_submission_status(submission_id, 'CompilationError', conn)


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

        compiler_config = compiler_configs[test_to_worker.lang]

        if compiler_config.is_compilable:
            result = compile(test_to_worker.submission_code_path, compiler_config)

            if result is None:
                compilation_error(submission_id, pool)
                return

            loop.run_until_complete(execute_test(test_to_worker, pool, result))
        else:
            loop.run_until_complete(execute_test(test_to_worker, pool))

        completed_tests[submission_id] -= 1

        if completed_tests[submission_id] == 0:
            loop.run_until_complete(update_task_bests(submission_id, pool))
