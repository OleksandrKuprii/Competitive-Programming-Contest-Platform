from datetime import datetime
from os import getenv

import asyncpg


CONNECTION_STRING = getenv('PG_CONN')

pg_conn = None


async def get_connection():
    global pg_conn
    if pg_conn is not None:
        return pg_conn

    pg_conn = await asyncpg.connect(CONNECTION_STRING)
    return pg_conn


async def get_points_for_tests(test_ids):
    with await get_connection() as conn:
        points = await conn.fetch('SELECT points FROM test'
                                  'WHERE test_id = any($1::int[])', test_ids)

    return [x['points'] for x in points]


async def add_results_to_db(results):
    data_to_query = [(result.status,
                      result.points,
                      result.submission_id,
                      result.test_id,
                      result.wall_time,
                      result.cpu_time) for result in results]

    with await get_connection() as conn:
        await conn.executemany('INSERT INTO result (status, points,'
                               ' submission_id, test_id, wall_time, cpu_time) '
                               'VALUES($1, $2, $3, $4, $5, $6)', data_to_query)


async def change_submission_status(submission_id, status):
    with await get_connection() as conn:
        await conn.execute('UPDATE submission SET status = $1 '
                           'WHERE submission_id = $2', status, submission_id)


async def get_test_ids(task_id):
    with await get_connection() as conn:
        test_ids = await conn.fetch(
            'SELECT test_id FROM test WHERE task_id = $1',
            task_id)

    return [x['test_id'] for x in test_ids]


async def add_submission(submission_to_db):
    user_id = submission_to_db.user_id
    task_id = submission_to_db.task_id
    timestamp = submission_to_db.timestamp
    date = datetime.fromtimestamp(timestamp)
    lang = submission_to_db.lang

    with await get_connection() as conn:
        await conn.execute('INSERT INTO submission (date, user_id, task_id,'
                           ' lang, status) VALUES($1, $2, $3, $4, $5)',
                           date, user_id, task_id, lang, 'None')
