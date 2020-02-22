create schema coreschema;

create table coreschema.users (
  id serial primary key,
  firebase_auth_uid varchar(128) unique,
  username varchar(50) unique,
  email varchar(255) unique,
  display_name varchar(128),
  role varchar(50)
);

create table tasks (
  id serial primary key,
  alias varchar(128) unique,
  name varchar(128) unique,
  wall_time_limit real,
  cpu_time_limit real,
  memory_limit int
);

create table submissions (
  id serial primary key,
  published_at timestamp,
  user_id int references users(id),
  lang varchar(50),
  task_id int references tasks(id),
  status varchar(50)
);

create table tests (
  id serial primary key,
  points int,
  task_id int references tasks(id)
);

create table results (
  id serial primary key,
  status varchar(50),
  points int,
  submission_id int references submissions(id),
  test_id int references tests(id),
  wall_time real,
  cpu_time real
);
