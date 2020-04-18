"""The module to communicate with database about statistic."""
from asyncpg.connection import Connection

from typing import List


async def get_data_task_with_lang(task_id: int, conn: Connection) \
        -> List[dict]:
    """Get data for one task with language.

    A function to get information from database table task_statistic: number
    of full answers, partial, zero for each programming language present in
    database for this task.

    Parameters
    ----------
    task_id: int
        The id of the task
    conn: Connection
        The connection to the database

    Returns
    -------
    _: List[dict]
        The list of dictionaries in which contains information about one
        language and whole list represents information for whole task
    """
    # Get information from the database
    async with conn.transaction():
        fetch = await conn.fetch('''
            SELECT lang, "full", partial, zero
            FROM coreschema.task_statistic
            WHERE task_id = $1
        ''', task_id)

    # Cast list of Records to list of dictionaries
    return [dict(f) for f in fetch]


async def get_data_task(task_id: int, conn: Connection) -> dict:
    """Get data for one task without language.

    A function to get information from database table task_statistic: number
    of full answers, partial, zero for one task.

    Parameters
    ----------
    task_id: int
        The id of the task
    conn: Connection
        The connection to the database

    Returns
    -------
    _: dict
        The dictionary contains statistic for about one task
    """
    # Get information from the database
    async with conn.transaction():
        fetch = await conn.fetchrow('''
            SELECT sum("full") as "full", sum(partial) as partial,
                sum(zero) as zero
            FROM coreschema.task_statistic
            WHERE task_id = $1
            GROUP BY task_id
        ''', task_id)

    # If fetch is not None
    if fetch is not None:
        # Cast Record to dictionary and return
        return dict(fetch)
    else:
        # Else - the statistic is not provided, so function returns empty data
        return {'full': 0, 'partial': 0, 'zero': 0}
