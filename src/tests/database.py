import src.database as db
import pytest
import asyncpg
from datetime import datetime
import os

from src.dataclass import ResultToDB


postgres_host = os.getenv('POSTGRES_HOST', 'postgres')
postgres_db = os.getenv('POSTGRES_DB')
postgres_user = os.getenv('POSTGRES_USER')
postgres_password = os.getenv('POSTGRES_PASSWORD')

database_uri = f'postgresql://{postgres_user}:{postgres_password}'
'@{postgres_host}/{postgres_db}'


async def setUpDatabase():
    await db.establish_connection(database_uri)

    with open('src/schema/coreschema.sql') as schema_file:
        with open('src/tests/dropall.sql') as dropall_file:
            await db.conn.execute(dropall_file.read() + schema_file.read())


async def table_insert(name, columns, *rows):
    for row in rows:
        values = map(lambda x: f'${x}', range(1, len(columns) + 1))

        await db.conn.execute(f'insert into {name} ({",".join(columns)}) '
                              f'values ({",".join(values)})', *row)


@pytest.mark.asyncio
async def test_get_connection(monkeypatch):
    async def mock_connect(conn_string):
        return conn_string

    monkeypatch.setattr(asyncpg, 'connect', mock_connect)

    await db.establish_connection('myconnstring')

    assert db.conn == 'myconnstring'


@pytest.mark.asyncio
async def test_get_points_for_test():
    await setUpDatabase()

    tasks = (('first-task',  'My first task!',  0.2, 0.1, 256),
             ('second-task', 'My second task!', 0.3, 0.2, 256))

    await table_insert('coreschema.tasks',
                       ('alias', 'name', 'wall_time_limit',
                        'cpu_time_limit', 'memory_limit'), *tasks)

    tests = ((10, 1), (20, 1), (30, 2))

    await table_insert('coreschema.tests', ('points', 'task_id'), *tests)

    assert await db.get_points_for_tests([1, 2, 3]) == [10, 20, 30]


@pytest.mark.asyncio
async def test_add_results_to_db():
    await setUpDatabase()

    users = (('myusername', 'example@example.com', 'regular'),)

    await table_insert('coreschema.users',
                       ('username', 'email', 'role'), *users)

    tasks = (('first-task',  'My first task!',  0.2, 0.1, 256),
             ('second-task', 'My second task!', 0.3, 0.2, 256))

    await table_insert('coreschema.tasks', ('alias', 'name', 'wall_time_limit',
                       'cpu_time_limit', 'memory_limit'), *tasks)

    submissions = ((datetime.now(), 1, 'python3', 1, 'somestatus'),)

    await table_insert('coreschema.submissions', ('published_at', 'user_id',
                       'lang', 'task_id', 'status'), *submissions)

    tests = ((10, 1), (20, 1), (30, 2))

    await table_insert('coreschema.tests', ('points', 'task_id'), *tests)

    results = [ResultToDB(**result) for result in (
        {'status': 'somestatus', 'points': 10, 'submission_id': 1,
         'test_id': 1, 'wall_time': 0.5, 'cpu_time': 0.3},
    )]

    await db.add_results_to_db(results)

    assert True
