create schema if not exists coreschema;

create table if not exists coreschema.tournaments
(
    id serial primary key,
    info varchar,
    participants integer[]
);

create table if not exists coreschema.categories (
    id serial primary key,
    alias varchar(50) unique,
    name varchar
);

create table if not exists coreschema.tasks (
    id serial primary key,
    alias varchar(128) unique,
    name varchar(128) unique,
    category varchar(50) references coreschema.categories(alias),
    difficulty int,
    wall_time_limit int,
    cpu_time_limit int,
    memory_limit int,
    created timestamp
);

create table if not exists coreschema.users
(
    id varchar unique primary key,
    nickname varchar unique,
    name varchar,
    birthday date,
    country varchar,
    bio text,
    city varchar,
    school varchar,
    email varchar,
    picture varchar,
    registered timestamp with time zone
);

create table if not exists coreschema.rating
(
    id serial,
    user_id varchar references coreschema.users(id),
    public_task_rating int
);

create table if not exists coreschema.task_descriptions (
    task_id int references coreschema.tasks(id),
    alias varchar(50) references coreschema.tasks(alias),
    main text,
    input_format text,
    output_format text,
    custom_sections json
);

create table if not exists coreschema.task_examples (
    task_id int references coreschema.tasks(id),
    alias varchar(50) references coreschema.tasks(alias),
    input_data text,
    output_data text
);

create table if not exists coreschema.submissions (
    id serial primary key,
    published_at timestamp with time zone,
    user_id varchar(50) references coreschema.users(id),
    lang varchar(50),
    task_id int references coreschema.tasks(id),
    status varchar(50),
    tournament_id int references coreschema.tournaments(id)
);

create table if not exists coreschema.tests (
    id serial primary key,
    points int,
    task_id int references coreschema.tasks(id)
);

create table if not exists coreschema.results (
    id serial primary key,
    status varchar(50),
    points int,
    submission_id int references coreschema.submissions(id),
    test_id int references coreschema.tests(id),
    wall_time int,
    cpu_time int
);

create table if not exists coreschema.task_bests (
    id serial primary key,
    user_id varchar(50) references coreschema.users(id),
    task_id int references coreschema.tasks(id),
    submission_id int references coreschema.submissions(id)
);

create table if not exists coreschema.task_statistic
(
	id serial,
	task_id int references coreschema.tasks(id),
	lang varchar,
	"full" int,
	partial int,
	zero int
);

CREATE OR REPLACE FUNCTION coreschema.modify_task_best(integer)
RETURNS integer
AS
$$
DECLARE
    a integer;
    points_count integer;
    max_points_count integer;
    _user_id varchar;
    _task_id integer;

BEGIN
    _user_id = (SELECT user_id
               FROM coreschema.submissions
               WHERE submissions.id = $1);
    _task_id = (SELECT submissions.task_id
               FROM coreschema.submissions
               WHERE submissions.id = $1);

    SELECT COUNT(*) INTO a
    FROM coreschema.task_bests
    WHERE task_bests.user_id = _user_id AND task_bests.task_id = _task_id;

    IF a = 0 THEN
        INSERT INTO coreschema.task_bests (user_id, task_id, submission_id)
        (SELECT submissions.user_id, submissions.task_id, $1
         FROM coreschema.submissions
         WHERE submissions.id = $1);

    ELSE
        SELECT MAX(points) INTO max_points_count
        FROM (SELECT SUM(points) as points
              FROM coreschema.results
              WHERE submission_id IN (SELECT id
                                      FROM coreschema.submissions
                                      WHERE user_id = _user_id
                                        AND task_id = _task_id
                                        AND id != $1)
              GROUP BY submission_id) as some_table;

        SELECT SUM(points) INTO points_count
        FROM coreschema.results
        WHERE submission_id = $1;

        IF points_count > max_points_count THEN
            UPDATE coreschema.task_bests
            SET submission_id = $1
            WHERE task_id = _task_id AND user_id = _user_id;

        END IF;
    END IF;

    RETURN NULL;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION coreschema.get_submission_status_for_result(integer, varchar)
RETURNS varchar
AS
$$
DECLARE
    statuses varchar[];
    res varchar;

BEGIN

    SELECT array_agg(DISTINCT results.status) INTO statuses
    FROM coreschema.results
    JOIN coreschema.submissions
    ON results.submission_id = submissions.id
    WHERE submission_id = $1 AND user_id = $2;

    IF statuses is NULL THEN
        SELECT status INTO res
        FROM coreschema.submissions
        WHERE id = $1 AND user_id = $2;

        RETURN res;
    END IF;

    RETURN NULL;
END;
$$
LANGUAGE plpgsql;