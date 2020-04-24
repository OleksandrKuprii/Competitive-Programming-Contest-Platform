"""The database module for gather_statistic packet."""
from typing import List

from asyncpg.connection import Connection


async def collect_task_data(conn: Connection) -> List[dict]:
    """Collect data about one task.

    The data is collected from table task_bests.
    For each best submission collects task_id, language, sum of points

    Parameters
    ----------
    conn: Connection
        The connection to the database

    Returns
    -------
    _: List[dict]
        The list of dictionaries where each one contains information as above
    """
    async with conn.transaction():
        res = await conn.fetch("""
            SELECT task_bests.task_id, lang, SUM(points) AS points
            FROM coreschema.task_bests
            JOIN coreschema.submissions
            ON coreschema.submissions.id = coreschema.task_bests.submission_id
            JOIN coreschema.results
            ON coreschema.results.submission_id =
                coreschema.task_bests.submission_id
            GROUP BY lang, task_bests.task_id, task_bests.user_id
            ORDER BY task_id;
            """)

    # Cast list of Records to list of dictionaries
    return [dict(x) for x in res]


async def insert_task_statistic(data: List[tuple], conn: Connection) -> None:
    """Insert data about one task to the task_statistic table.

    Parameters
    ----------
    data: List[tuple]
        The list of tuples where each one should be inserted in the database
    conn: Connection
        The connection to the database
    """
    async with conn.transaction():
        await conn.executemany('''
            INSERT INTO coreschema.task_statistic
                (task_id, lang, "full", partial, zero)
            VALUES ($1, $2, $3, $4, $5)
        ''', data)
