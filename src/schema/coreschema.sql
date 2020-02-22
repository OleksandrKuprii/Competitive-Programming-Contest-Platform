create schema if not exists coreschema;

create table if not exists coreschema.users (
  id serial primary key,
  username varchar(50) unique,
  email varchar(255) unique,
  role varchar(50)
);

create table if not exists coreschema.tasks (
  id serial primary key,
  alias varchar(128) unique,
  name varchar(128) unique,
  wall_time_limit real,
  cpu_time_limit real,
  memory_limit int
);

create table if not exists coreschema.submissions (
  id serial primary key,
  published_at timestamp,
  user_id int references coreschema.users(id),
  lang varchar(50),
  task_id int references coreschema.tasks(id),
  status varchar(50)
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
  wall_time real,
  cpu_time real
);
