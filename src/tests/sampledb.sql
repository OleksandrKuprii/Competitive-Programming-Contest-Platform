INSERT INTO coreschema.users (username, email, role)
VALUES ('user0',
        'user0@mail.com',
        'regular')
INSERT INTO coreschema.users (username, email, role)
VALUES ('user1',
        'user1@mail.com',
        'regular')
INSERT INTO coreschema.users (username, email, role)
VALUES ('user2',
        'user2@mail.com',
        'regular')
INSERT INTO coreschema.users (username, email, role)
VALUES ('admin0',
        'admin0@mail.com',
        'admin')
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit)
VALUES ('task0',
        'Task 0',
        300,
        200,
        256)
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit)
VALUES ('task1',
        'Task 1',
        500,
        400,
        500)
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit)
VALUES ('task3',
        'Task 3',
        1000,
        700,
        100)
INSERT INTO coreschema.submissions (published_at, user_id, lang, task_id, status)
VALUES (1999-01-08 04:05:06,
                         1,
                         'python3',
                         1,
                         'UE')
INSERT INTO coreschema.submissions (published_at, user_id, lang, task_id, status)
VALUES (2000-02-07 10:09:03,
                         2,
                         'cpp',
                         2,
                         'OK')
INSERT INTO coreschema.submissions (published_at, user_id, lang, task_id, status)
VALUES (2005-05-10 00:00:06,
                         3,
                         'c',
                         3,
                         'WA')
INSERT INTO coreschema.tests (points, task_id)
VALUES (10,
        1)
INSERT INTO coreschema.tests (points, task_id)
VALUES (20,
        2)
INSERT INTO coreschema.tests (points, task_id)
VALUES (30,
        3)