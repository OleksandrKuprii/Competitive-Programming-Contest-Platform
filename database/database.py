import asyncpg
from datetime import datetime


CONNECTION_STRING = 'postgres://cddsswrc:dSRcOWmF8c7KyEremoKSaik_0ZEIHzgE@balarama.db.elephantsql.com:5432/cddsswrc'


async def get_points_for_test(test_ids):
    conn = await asyncpg.connect(CONNECTION_STRING)

    points = await conn.fetch('SELECT points FROM test WHERE test_id = any($1::int[])', test_ids)
    points = [x['points'] for x in points]
    return points


async def add_results_to_db(results):
    conn = await asyncpg.connect(CONNECTION_STRING)
    data_to_query = []

    for result in results:
        status = result.status
        points = result.points
        submission_id = result.submission_id
        test_id = result.test_id
        wall_time = result.wall_time
        cpu_time = result.cpu_time

        data_to_query.append((status, points, submission_id, test_id, wall_time, cpu_time))

    await conn.executemany('''INSERT INTO result (status, points, submission_id, test_id, wall_time, cpu_time) 
                            VALUES($1, $2, $3, $4, $5, $6)''', data_to_query)


async def change_submission_status(submission_id, status):
    conn = await asyncpg.connect(CONNECTION_STRING)

    await conn.execute('UPDATE submission SET status = $1 WHERE submission_id = $2', status, submission_id)


async def get_test_ids(task_id):
    conn = await asyncpg.connect(CONNECTION_STRING)

    test_ids = await conn.fetch('SELECT test_id FROM test WHERE task_id = $1', task_id)
    test_ids = [x['test_id'] for x in test_ids]

    return test_ids


async def add_submission(submission_to_db):
    conn = await asyncpg.connect(CONNECTION_STRING)

    user_id = submission_to_db.user_id
    task_id = submission_to_db.task_id
    timestamp = submission_to_db.timestamp
    date = datetime.fromtimestamp(timestamp)
    lang = submission_to_db.lang

    await conn.execute('INSERT INTO submission (date, user_id, task_id, lang, status) VALUES($1, $2, $3, $4, $5)',
                       date, user_id, task_id, lang, 'None')
