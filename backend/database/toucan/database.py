from datetime import datetime
from typing import List

import asyncpg

from toucan.dataclass import ResultToDB, SubmissionToDB

# Declaring global variable for connection
conn = None


async def establish_connection(connection_string: str) -> None:
    """Establishes connection to the database with connection
    string and sets connection to global variable conn

    Parameters
    ----------
    connection_string : str
    """

    global conn
    conn = await asyncpg.connect(connection_string)


async def establish_connection_params(**kwargs: dict) -> None:
    """Establishes connection to the database with connection
    parameters and sets connection to global variable conn

    Parameters
    ----------
    **kwargs : dict
        The parameters that sets the connection
    """

    global conn
    conn = await asyncpg.connect(**kwargs)


async def get_points_for_tests(test_ids: List[int]) -> List[int]:
    """Gets value of points for each test by test ids
    from database and returns it

    Parameters
    ----------
    test_ids : List[int]
        The list of test ids

    Returns
    -------
    _ : List[int]
        The list of points for each test sorted as ids
    """

    points = await conn.fetch(
        'SELECT points FROM coreschema.tests WHERE id = ANY($1::int[])',
        test_ids)

    return [x['points'] for x in points]


async def add_results_to_db(results: List[ResultToDB]) -> None:
    """Adds results of checking to the database

    Parameters
    ----------
    results : List[ResultToDB]
        The list of ResultToDB objects
    """

    # Presenting list of ResultToDB object to list of tuples
    data_to_query = [(result.status, result.points, result.submission_id,
                      result.test_id, result.wall_time, result.cpu_time)
                     for result in results]

    await conn.executemany(
        'INSERT INTO coreschema.results (status, points,'
        ' submission_id, test_id, wall_time, cpu_time) '
        'VALUES ($1, $2, $3, $4, $5, $6)', data_to_query)


async def change_submission_status(submission_id: int, status: str) -> None:
    """Changes status of the submission in the database by submission id

    Parameters
    ----------
    submission_id : int
        The primary key in the submission table in thedatabase
    status : str
        The string to update in the database
    """

    await conn.execute(
        'UPDATE coreschema.submissions SET status = $1'
        'WHERE id = $2', status, submission_id)


async def get_test_ids(task_id: int) -> List[int]:
    """Gets list of test id from the database by the task id

    Parameters
    ----------
    task_id : int
        The primary key in the table tests in the database

    Returns
    -------
    _ : List[int]
        The list of test ids
    """

    test_ids = await conn.fetch(
        'SELECT id FROM coreschema.tests WHERE task_id = $1', task_id)

    return [x['id'] for x in test_ids]


async def add_submission(submission_to_db: SubmissionToDB) -> int:
    """Inserts submission to the submission table in the database
    and returns its id

    Parameters
    ----------
    submission_to_db : SubmissionToDB

    Returns
    -------
    _ : int
        The id of the inserted submission
    """

    # Presenting SubmissionToDB object values to the variables
    user_id = submission_to_db.user_id
    task_id = submission_to_db.task_id
    timestamp = submission_to_db.timestamp
    date = datetime.fromtimestamp(timestamp)
    lang = submission_to_db.lang

    res = await conn.fetch(
        'INSERT INTO coreschema.submissions (published_at, user_id, task_id,'
        'lang, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', date,
        user_id, task_id, lang, 'Received')

    return res[0]['id']


async def get_limits(task_id: int) -> dict:
    """Gets limits for specific test and returns it
    Limits: wall_time, real_time, memory

    Parameters
    ----------
    task_id : int
        The primary key of the task table in the database

    Returns
    -------
    _ : dict
        Returns limits as a dict
    """

    res = await conn.fetch(
        '''SELECT wall_time_limit, cpu_time_limit, memory_limit
           FROM coreschema.tasks
           WHERE id = $1''', task_id)
    return res[0]
