"""The packet to get statistic from."""
from asyncpg.connection import Connection
from statistic import database

from typing import List


async def get_data_task_with_lang(task_id: int, conn: Connection) \
        -> List[dict]:
    """Call function of the same name from database module."""
    return await database.get_data_task_with_lang(task_id, conn)


async def get_data_task(task_id: int, conn: Connection):
    """Call function of the same name from database module."""
    return await database.get_data_task(task_id, conn)


async def update_public_task_rating(submission_id: int, conn: Connection):
    """Update public task result rating by submission id.

    Parameters
     ----------
     submission_id: int
        The id of the submission
     conn: Connection
        The connection to the database
    """
    if await database.check_necessity_of_updating_rating(submission_id, conn):

        await database.update_public_task_rating(submission_id, conn)
