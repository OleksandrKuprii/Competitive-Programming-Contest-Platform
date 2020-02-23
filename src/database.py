from datetime import datetime
import asyncpg


conn = None


async def establish_connection(connection_string):
    global conn
    conn = await asyncpg.connect(connection_string)


async def establish_connection_params(**kwargs):
    global conn
    conn = await asyncpg.connect(**kwargs)


async def get_points_for_tests(test_ids):
    points = await conn.fetch(
        'select points from coreschema.tests where id = any($1::int[])',
        test_ids)

    return [x['points'] for x in points]


async def add_results_to_db(results):
    data_to_query = [(result.status,
                      result.points,
                      result.submission_id,
                      result.test_id,
                      result.wall_time,
                      result.cpu_time) for result in results]

    await conn.executemany('insert into coreschema.results (status, points,'
                           ' submission_id, test_id, wall_time, cpu_time) '
                           'values ($1, $2, $3, $4, $5, $6)', data_to_query)


async def change_submission_status(submission_id, status):
    await conn.execute('update coreschema.submissions set status = $1 '
                       'where id = $2', status, submission_id)


async def get_test_ids(task_id):
    test_ids = await conn.fetch(
        'select id from test where task_id = $1',
        task_id)

    return [x['test_id'] for x in test_ids]


async def add_submission(submission_to_db):
    user_id = submission_to_db.user_id
    task_id = submission_to_db.task_id
    timestamp = submission_to_db.timestamp
    date = datetime.fromtimestamp(timestamp)
    lang = submission_to_db.lang

    await conn.execute(
        'insert into coreschema.submissions (date, user_id, task_id,'
        ' lang, status) values ($1, $2, $3, $4, $5)',
        date, user_id, task_id, lang, 'None')
