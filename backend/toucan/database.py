"""Handles database logic."""
import json
import os
from typing import List, Optional

import asyncpg
from asyncpg.pool import Pool
from asyncpg.connection import Connection

from dataclass import ResultToDB, UserSubmission


async def establish_connection_from_env() -> Pool:
    """Establish connection using environment variables."""
    if 'PG_CONN' in os.environ:
        return await establish_connection(os.getenv(
            'POSTGRES_CONNECTION_STRING'))
    else:
        return await establish_connection_params(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            database=os.getenv('POSTGRES_DB'))


async def establish_connection(connection_string: str) -> Pool:
    """Establish connection to the database.

    Parameters
    ----------
    connection_string : str
    """
    return await asyncpg.create_pool(connection_string)


async def establish_connection_params(**kwargs: object) -> Pool:
    """Establish connection to the database.

    Parameters
    ----------
    **kwargs : dict
        The parameters that set the connection
    """
    return await asyncpg.create_pool(**kwargs)


async def get_points_for_tests(test_ids: List[int], conn: Connection) \
        -> List[int]:
    """Get value of points for each test by test ids.

    Parameters
    ----------
    test_ids : List[int]
        The list of test ids
    conn: Connection
        A connection to the database

    Returns
    -------
    _ : List[int]
        The list of points for each test sorted as ids
    """
    async with conn.transaction():
        points = await conn.fetch(
            'SELECT points FROM coreschema.tests '
            'WHERE id = ANY($1::int[])',
            test_ids)

    return [x['points'] for x in points]


async def add_results_to_db(results: List[ResultToDB], conn: Connection) \
        -> None:
    """Add results of checking to the database.

    Parameters
    ----------
    results : List[ResultToDB]
        The list of ResultToDB objects
    conn: Connection
        A connection to the database
    """
    # Presenting list of ResultToDB object to list of tuples
    data_to_query = [(result.status, result.points, result.submission_id,
                      result.test_id, result.wall_time, result.cpu_time)
                     for result in results]
    async with conn.transaction():
        await conn.executemany(
            'INSERT INTO coreschema.results (status, points,'
            ' submission_id, test_id, wall_time, cpu_time) '
            'VALUES ($1, $2, $3, $4, $5, $6)', data_to_query)


async def change_submission_status(submission_id: int, status: str,
                                   conn: Connection) -> None:
    """Change status of a submission.

    Parameters
    ----------
    submission_id : int
        The primary key in the submission table in the database
    status : str
        The string to update in the database
    conn: Connection
        A connection to the database
    """
    async with conn.transaction():
        await conn.execute(
            'UPDATE coreschema.submissions SET status = $1 \
            WHERE id = $2', status, submission_id)


async def get_test_ids(task_id: int, conn: Connection) -> List[int]:
    """Get list of test id from the database by the task id.

    Parameters
    ----------
    task_id : int
        The primary key in the table tests in the database
    conn: Connection
        A connection to the database

    Returns
    -------
    _ : List[int]
        The list of test ids
    """
    async with conn.transaction():
        test_ids = await conn.fetch(
            'SELECT id FROM coreschema.tests WHERE task_id = $1', task_id)

    return [x['id'] for x in test_ids]


async def add_submission(submission_to_db: UserSubmission, conn: Connection) \
        -> tuple:
    """Add submission and return its id.

    Parameters
    ----------
    submission_to_db : SubmissionToDB
    conn: Connection
        A connection to the database

    Returns
    -------
    _ : tuple
        The id of the inserted submission and the id of the task
    """
    # Presenting SubmissionToDB object values to the variables
    user_id = submission_to_db.user_id
    alias = submission_to_db.alias
    date = submission_to_db.timestamp
    lang = submission_to_db.lang

    async with conn.transaction():
        # Getting task id by alias from tasks table
        fetch = await conn.fetchrow('''
            SELECT id
            FROM coreschema.tasks
            WHERE alias = $1
        ''', alias)

        task_id = int(fetch['id'])

        # Inserting submission to submission table and getting its id
        res = await conn.fetch(
            'INSERT INTO coreschema.submissions'
            '(published_at, user_id, task_id,'
            'lang, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', date,
            user_id, task_id, lang, 'Received')

    return res[0]['id'], task_id


async def get_limits(task_id: int, conn: Connection) -> dict:
    """Get limits for test.

    Parameters
    ----------
    task_id : int
        The primary key of the task table in the database
    conn: Connection
        A connection to the database

    Returns
    -------
    _ : dict
        Returns limits as a dict
    """
    async with conn.transaction():
        res = await conn.fetch(
            '''SELECT wall_time_limit, cpu_time_limit, memory_limit
               FROM coreschema.tasks
               WHERE id = $1''', task_id)

    return res[0]


async def get_task(alias: str, conn: Connection) -> dict:
    """Get task information from database.

    Parameters
    ----------
    alias: str
        The alias of the task
    conn: Connection
        A connection to the database

    Returns
    -------
    task: dict
        The dictionary contains all task description
    """
    async with conn.transaction():
        # Getting task information from tasks and task_description tables
        task_fetch = await conn.fetchrow(
            '''SELECT tasks.name as task_name, tasks.alias as
                task_alias, wall_time_limit, cpu_time_limit, memory_limit,
                main, input_format, output_format, custom_sections,
                category, categories.name
               FROM coreschema.tasks as tasks
               JOIN coreschema.task_descriptions as task_desc
               ON tasks.alias = task_desc.alias
               JOIN coreschema.categories
               ON category = categories.alias
               WHERE tasks.alias = $1
            ''', alias)

        # Creating dictionary from fetch from query
        task = {k: v for k, v in task_fetch.items()}

        # Asyncpg converts PostgresSQL's json type to Python's str type,
        # so we should convert str to json
        task['custom_sections'] = json.loads(task['custom_sections'])

        # Storing information about category in separate dictionary and
        # putting in task dictionary with key 'category'
        task['category'] = {'alias': task.pop('category'),
                            'name': task.pop('name')}

        # Changing keys in task dictionary to shorter and more
        # comfortable to use in frontend
        task['name'] = task.pop('task_name')
        task['alias'] = task.pop('task_alias')

        # Getting input and output examples from the task_examples table
        examples_fetch = await conn.fetch(
            '''SELECT input_data, output_data
               FROM coreschema.task_examples
               WHERE alias = $1
            ''', alias)

    # Creating list of dictionaries from fetch from query
    examples = []
    for ex in examples_fetch:
        examples.append({k: v for k, v in ex.items()})

    task['examples'] = examples

    return task


async def get_tasks(additional_sql: str, conn: Connection) \
        -> List[dict]:
    """Get {number} of tasks skipping first {offset} ones.

    Parameters
    ----------
    additional_sql: str
        The string contains SQL with sorting and filtering. Must be added to
        main SQL script
    conn: Connection
        A connection to the database

    Returns
    -------
    data: List[dict]
        The list includes dictionaries, which represents one task
    """
    async with conn.transaction():

        # Getting information from tasks table
        fetch = await conn.fetch(f'''
                SELECT tasks.id, tasks.alias, tasks.name as task_name,
                category, categories.name as category_name, difficulty, created
                FROM coreschema.tasks
                JOIN coreschema.categories
                ON category = categories.alias
                {additional_sql}
            ''')

    data = list()

    # Getting data from fetch
    for x in fetch:

        temp_dict = dict()

        for k, v in x.items():

            # If key is 'task_name' save value with key 'name'
            if k == 'task_name':
                temp_dict['name'] = v
            else:
                temp_dict[k] = v

        # Storing information about category in separate dictionary and
        # putting in task dictionary with key 'category'
        temp_dict['category'] = {'alias': temp_dict.pop('category'),
                                 'name': temp_dict.pop('category_name')}

        # Converting datetime object to ISO-format
        temp_dict['created'] = temp_dict['created'].isoformat()

        data.append(temp_dict)

    return data


async def get_submission_id_from_bests(user_id: str, task_id: int,
                                       conn: Connection) -> Optional[int]:
    """Get submission id from task_bests table by user id and task id.

    Parameters
    ----------
    user_id: str
        The id of user
    task_id: int
        The id of task
    conn: Connection
        A connection to the database

    Returns
    -------
    _: Optional[int, None]
        Submission id if it exists, else - None
    """
    async with conn.transaction():

        # Getting submission id from task_bests table
        fetch = await conn.fetchrow('''
            SELECT submission_id
            FROM coreschema.task_bests
            WHERE user_id = $1 AND task_id = $2
        ''', user_id, task_id)

    # If fetch is not None, than submission id exists and function returns it
    if fetch is not None:
        return fetch['submission_id']
    return None


async def get_result(submission_id: int, user_id: str, conn: Connection) \
        -> tuple:
    """Get result from database.

    Parameters
    ----------
    submission_id: int
        The id of submission
    user_id: str
        The id of user
    conn: Connection
        A connection to the database

    Returns
    -------
    _: tuple
        Points and statuses for submission
    """
    async with conn.transaction():

        # Getting submission status for result from database
        status = await conn.fetch(
            '''SELECT get_submission_status_for_result as status
            FROM coreschema.get_submission_status_for_result($1, $2)''',
            submission_id, user_id)

        status = status[0]['status']

        # If status is not None, returning None of points and this status
        if status is not None:
            return None, status

        # Getting number of points and result statuses from database
        result = await conn.fetch(
            '''SELECT sum(points) as points,
                      array_agg(DISTINCT results.status) as status
               FROM coreschema.results
               JOIN coreschema.submissions
               ON results.submission_id = submissions.id
               WHERE submission_id = $1 AND user_id = $2''',
            submission_id, user_id)

    return result[0]['points'], result[0]['status']


async def update_task_bests(submission_id: int, conn: Connection) -> None:
    """Update task_bests table.

    Update task_bests table by changing submission id in existing
    task_bests table row.

    Parameters
    ----------
    submission_id: int
        The submission of id
    conn: Connection
        A connection to the database
    """
    async with conn.transaction():
        # Calling an already writen function from database
        await conn.execute('SELECT coreschema.modify_task_best($1)',
                           submission_id)


async def get_submissions(user_id: str, number: int, offset: int,
                          conn: Connection) -> List[dict]:
    """Get submissions.

    Get information about {number} of submissions skipping {offset}
    submissions from start for specific user.

    Parameters
    ----------
    user_id: str
        The id of user
    number: int
        The number of tasks to return
    offset: int
        The number of tasks to miss from start
    conn: Connection
        A connection to the database

    Returns
    -------
    submissions: List[dict]
        The list of dictionaries, each one describes one submission
    """
    async with conn.transaction():

        # Getting information about submission from submission and task
        # table
        fetch = await conn.fetch(
            '''SELECT submissions.id, name, alias, lang, published_at
               FROM coreschema.submissions
               LEFT JOIN coreschema.tasks
               ON tasks.id = task_id
               WHERE user_id = $1
               ORDER BY id DESC
               LIMIT $2 OFFSET $3;''',
            user_id, number, offset)

    submissions = []

    # Converting fetch to List[dict]
    for x in fetch:
        d = dict()
        for k, v in x.items():
            d[k] = v
            if k == 'published_at':
                d[k] = v.isoformat()
        submissions.append(d)

    return submissions


async def get_submission(submission_id: int, user_id: str, conn: Connection) \
        -> dict:
    """Get one submission by submission id.

    Parameters
    ----------
    submission_id: int
        The id of submission
    user_id: str
        The id of user
    conn: Connection
        A connection to the database

    Returns
    -------
    submission: dict
        The information about one submission
    """
    async with conn.transaction():
        # Getting submission information from submissions and tasks tables
        fetch = await conn.fetchrow('''
            SELECT name, alias, lang, published_at as timestamp
            FROM coreschema.submissions
            LEFT JOIN coreschema.tasks
            ON tasks.id = task_id
            WHERE submissions.id = $1 AND submissions.user_id = $2''',
                                    submission_id, user_id)

    # Converting fetch to dictionary
    submission = {k: v for k, v in fetch.items()}

    # Converting datetime to ISO-format
    submission['timestamp'] = submission['timestamp'].isoformat()

    return submission


async def get_test_results(submission_id: int, user_id: str,
                           conn: Connection) -> List[dict]:
    """Get test results by submission id.

    Parameters
    ----------
    submission_id: int
        The id of submission
    user_id: str
        The id of user
    conn: Connection
        A connection to the database

    Returns
    -------
    tests: List[dict]
        The list of dictionaries, each one contains information about one test
    """
    async with conn.transaction():
        # Getting test results from results table
        fetch = await conn.fetch(
            '''SELECT points, results.status, wall_time, cpu_time
               FROM coreschema.results
               JOIN coreschema.submissions
               ON results.submission_id = submissions.id
               WHERE submission_id = $1 AND user_id = $2''',
            submission_id, user_id)

    tests = list()

    # Converting fetch to List[dict]
    for f in fetch:
        temp_dict = {}
        for k, v in f.items():
            temp_dict[k] = v
        tests.append(temp_dict)

    return tests


async def get_task_id_from_alias(alias: str, conn: Connection) -> int:
    """Get user id from alias.

    Parameters
    ----------
    alias: str
        The alias of task
    conn: Connection
        A connection to the database

    Returns
    -------
    _: int
        The id of the task
    """
    async with conn.transaction():
        # Getting task from tasks table by alias
        fetch = await conn.fetchrow('''
                SELECT id
                FROM coreschema.tasks
                WHERE alias = $1
            ''', alias)

    return fetch['id']
