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


async def update_public_task_rating(submission_id: int, conn: Connection):
    """Update public task result rating by submission id.

    From submission id function gets all information: user id, task id, amount of points. So it
    does not need any other parameters.

    Parameters
    ----------
    submission_id: int
        The id of the submission
    conn: Connection
        The connection to the database
    """
    async with conn.transaction():
        fetch = await conn.fetchrow("""
            SELECT difficulty, user_id
            FROM coreschema.submissions
            JOIN coreschema.tasks
            ON tasks.id = task_id
            WHERE submissions.id = $1
        """, submission_id)

        difficulty = fetch['difficulty']
        user_id = fetch['user_id']

        fetch = await conn.fetchrow("""
            SELECT *
            FROM coreschema.rating
            WHERE user_id = $1
        """, user_id)

        if fetch is None:
            await conn.execute("""
                INSERT INTO coreschema.rating (user_id, public_task_rating) VALUES ($1, $2)
            """, user_id, difficulty)
        else:
            await conn.execute("""
                UPDATE coreschema.rating
                SET public_task_rating = public_task_rating + $1
                WHERE user_id = $2
            """, difficulty, user_id)


async def check_necessity_of_updating_rating(submission_id: int, conn: Connection) -> bool:
    """Check if there is necessity of updating public task rating.

    By submission id this function compares previous best number of points for this task and
    amount of points for this submission. If current is 100 and it is greater than previous
    returns True, else - False.

    Parameters
     ----------
     submission_id: int
        The id of the submission
     conn: Connection
        The connection to the database

    Returns
    -------
    _: bool
        The necessity of updating
    """
    async with conn.transaction():
        previous_points = await conn.fetchval("""
            SELECT sum(results.points)
            FROM coreschema.submissions
            JOIN coreschema.task_bests
            ON task_bests.task_id = submissions.task_id AND
                task_bests.user_id = submissions.user_id
            JOIN coreschema.results
            ON results.submission_id = task_bests.submission_id
            WHERE submissions.id = $1
            GROUP BY results.submission_id
        """, submission_id)

        current_points = await conn.fetchval("""
            SELECT SUM(points)
            FROM coreschema.results
            WHERE submission_id = $1
            GROUP BY submission_id
        """, submission_id)

        if previous_points is None:
            if current_points == 100:
                return True
            return False

        return current_points > previous_points and current_points == 100
