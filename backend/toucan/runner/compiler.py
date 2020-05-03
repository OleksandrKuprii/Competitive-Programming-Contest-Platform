"""The compiler for runner package."""
import os
from typing import List, Optional

import docker
from docker.models.volumes import Volume

import database
from dataclass import CompilerConfig, ResultToDB

client = docker.from_env()


async def compile(submission_code_path: str, config: CompilerConfig) -> Optional[Volume]:
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


async def compilation_error(submission_id: int, test_ids: List[int]):
    """Change submission status to CompilationError.

    Parameters
    ----------
    submission_id: int
    """
    pool = await database.establish_connection_from_env()

    async with pool.acquire() as conn:
        for test_id in test_ids:
            result_to_db = ResultToDB(submission_id=submission_id, test_id=test_id, points=0,
                                      wall_time=None, cpu_time=None, status='CompilationError')

            await database.add_result_to_db(result_to_db, conn)

        await database.change_submission_status(submission_id, 'Completed', conn)
