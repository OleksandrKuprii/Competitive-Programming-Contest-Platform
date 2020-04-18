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
