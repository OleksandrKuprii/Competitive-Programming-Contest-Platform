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
        'SELECT points FROM coreschema.tests WHERE id = ANY($1::int[])',
        test_ids)

    return [x['points'] for x in points]


async def add_results_to_db(results):
    data_to_query = [(result.status, result.points, result.submission_id,
                      result.test_id, result.wall_time, result.cpu_time)
                     for result in results]

    await conn.executemany(
        'INSERT INTO coreschema.results (status, points,'
        ' submission_id, test_id, wall_time, cpu_time) '
        'VALUES ($1, $2, $3, $4, $5, $6)', data_to_query)


async def change_submission_status(submission_id, status):
    await conn.execute(
        'UPDATE coreschema.submissions SET status = $1 '
        'WHERE id = $2', status, submission_id)


async def get_test_ids(task_id):
    test_ids = await conn.fetch(
        'SELECT id FROM coreschema.tests WHERE task_id = $1', task_id)

    return [x['id'] for x in test_ids]


async def add_submission(submission_to_db):
    user_id = submission_to_db.user_id
    task_id = submission_to_db.task_id
    timestamp = submission_to_db.timestamp
    date = datetime.fromtimestamp(timestamp)
    lang = submission_to_db.lang

    return await conn.fetch(
        'INSERT INTO coreschema.submissions (published_at, user_id, task_id,'
        'lang, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', date,
        user_id, task_id, lang, 'Received')


async def get_limits(task_id):
    return await conn.fetch(
        '''SELECT wall_time_limit, cpu_time_limit, memory_limit
           FROM coreschema.tasks
           WHERE id = $1''', task_id)
