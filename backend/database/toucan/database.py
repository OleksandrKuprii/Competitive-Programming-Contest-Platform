"""Handles database logic."""
import os
from datetime import datetime
from typing import List

import asyncpg

from toucan.dataclass import ResultToDB, SubmissionToDB

# Declaring global variable for connection
conn = None


async def establish_connection_from_env():
    """Establish connection using environment vars."""
    if 'PG_CONN' in os.environ:
        await establish_connection(os.getenv('POSTGRES_CONNECTION_STRING'))
    else:
        await establish_connection_params(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            database=os.getenv('POSTGRES_DB'))


async def establish_connection(connection_string: str):
    """Establish connection to the database.

    Parameters
    ----------
    connection_string : str
    """
    global conn
    conn = await asyncpg.connect(connection_string)


async def establish_connection_params(**kwargs: dict):
    """Establish connection to the database.

    Parameters
    ----------
    **kwargs : dict
        The parameters that set the connection
    """
    global conn
    conn = await asyncpg.connect(**kwargs)


async def get_points_for_tests(test_ids: List[int]) -> List[int]:
    """Get value of points for each test by test ids.

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
    """Add results of checking to the database.

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
    """Change status of a submission.

    Parameters
    ----------
    submission_id : int
        The primary key in the submission table in thedatabase
    status : str
        The string to update in the database
    """
    await conn.execute(
        'UPDATE coreschema.submissions SET status = $1 \
        WHERE id = $2', status, submission_id)


async def get_test_ids(task_id: int) -> List[int]:
    """Get list of test id from the database by the task id.

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
    """Add submission and return its id.

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
    """Get limits for test.

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


async def get_task(alias: int) -> []:
    """Task."""
    task_fetch = await conn.fetch(
        '''SELECT (wall_time_limit, cpu_time_limit, memory_limit,
                    task_desc.main, task_desc.input_format,
                    task_desc.output_format, task_desc.explanation)
           FROM coreschema.tasks as tasks
           FULL OUTER JOIN coreschema.task_descriptions as task_desc
           ON tasks.alias = task_desc.alias
           WHERE tasks.alias = $1
        ''', alias)

    if not task_fetch:
        return None

    task = list(task_fetch[0].values())

    examples_fetch = await conn.fetch(
        '''SELECT (input_data, output_data)
           FROM coreschema.task_examples
           WHERE alias = $1
        ''', alias)

    if not examples_fetch:
        return None

    examples = []
    for ex in examples_fetch:
        examples.append(tuple(ex.values())[0])

    return task + examples


async def get_tasks(user_id, number, offset) -> []:
    """Return task for task list page."""
    tasks_bests = await conn.fetch(
            '''SELECT alias, name, category, difficulty, SUM(points) as points,
                      array_agg(DISTINCT status) as status
               FROM coreschema.results
               LEFT JOIN coreschema.task_bests
               ON results.submission_id = task_bests.submission_id
               LEFT JOIN coreschema.tasks
               ON tasks.id = task_id
               WHERE task_bests.user_id = $3 AND
                     task_bests.task_id IN (SELECT id
                                            FROM coreschema.tasks
                                            LIMIT $1 OFFSET $2)
               GROUP BY alias, name, category, difficulty
            ''', number, offset, user_id)

    return [list(x.items()) for x in tasks_bests]


async def update_task_bests(submission_id):
    await conn.execute('SELECT coreschema.modify_task_best($1)', submission_id)
