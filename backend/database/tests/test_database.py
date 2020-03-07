import os
from datetime import datetime

import asyncpg
import pytest

import toucan.database as db
from toucan.dataclass import ResultToDB

postgres_host = os.getenv('POSTGRES_HOST', 'localhost')
postgres_db = os.getenv('POSTGRES_DB')
postgres_user = os.getenv('POSTGRES_USER')
postgres_password = os.getenv('POSTGRES_PASSWORD')


async def setUpDatabase():
    await db.establish_connection_params(host=postgres_host,
                                         user=postgres_user,
                                         password=postgres_password,
                                         database=postgres_db)

    with open('../../schema/coreschema.sql') as schema_file:
        with open('../../schema/dropall.sql') as dropall_file:
            await db.conn.execute(dropall_file.read() + schema_file.read())


async def table_insert(name, columns, *rows):
    for row in rows:
        values = map(lambda x: f'${x}', range(1, len(columns) + 1))

        await db.conn.execute(
            f'INSERT INTO {name} ({",".join(columns)}) '
            f'VALUES ({",".join(values)})', *row)


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

    tasks = (('first-task', 'My first task!', 0.2, 0.1, 256),
             ('second-task', 'My second task!', 0.3, 0.2, 256))

    await table_insert(
        'coreschema.tasks',
        ('alias', 'name', 'wall_time_limit', 'cpu_time_limit', 'memory_limit'),
        *tasks)

    tests = ((10, 1), (20, 1), (30, 2))

    await table_insert('coreschema.tests', ('points', 'task_id'), *tests)

    assert await db.get_points_for_tests([1, 2, 3]) == [10, 20, 30]

    await db.conn.close()


@pytest.mark.asyncio
async def test_add_results_to_db():
    await setUpDatabase()

    users = (('myusername', 'example@example.com', 'regular'), )

    await table_insert('coreschema.users', ('username', 'email', 'role'),
                       *users)

    tasks = (('first-task', 'My first task!', 200, 100, 256),
             ('second-task', 'My second task!', 300, 200, 256))

    await table_insert(
        'coreschema.tasks',
        ('alias', 'name', 'wall_time_limit', 'cpu_time_limit', 'memory_limit'),
        *tasks)

    submissions = ((datetime.now(), 1, 'python3', 1, 'somestatus'), )

    await table_insert(
        'coreschema.submissions',
        ('published_at', 'user_id', 'lang', 'task_id', 'status'), *submissions)

    tests = ((10, 1), (20, 1), (30, 2))

    await table_insert('coreschema.tests', ('points', 'task_id'), *tests)

    test_data = [{
        'status': 'somestatus',
        'points': 10,
        'submission_id': 1,
        'test_id': 1,
        'wall_time': 500,
        'cpu_time': 300
    }]

    results = [ResultToDB(**result) for result in test_data]

    await db.add_results_to_db(results)

    fetched_results = await db.conn.fetch('SELECT * FROM coreschema.results')

    assert len(fetched_results) == 1

    for row, test_item in zip(fetched_results, test_data):
        for key in test_item.keys():
            assert row[key] == test_item[key]

    await db.conn.close()
