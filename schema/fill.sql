INSERT INTO coreschema.users (username, email, role) VALUES ('SashaKuprii', 'a@c.com', 'admin');
INSERT INTO coreschema.users (username, email, role) VALUES ('IgorZash', 'b@c.com', 'admin');
INSERT INTO coreschema.users (username, email, role) VALUES ('ArthurSh', 'c@c.com', 'admin');

INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit) VALUES ('comics', 'Комікси', 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit) VALUES ('coins', 'Монети', 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit) VALUES ('stamps', 'Марки', 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit) VALUES ('wrappers', 'Фантики', 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, wall_time_limit, cpu_time_limit, memory_limit) VALUES ('equal_sets', 'Однакові підмножини', 1000, 1000, 256);

INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 1);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 2);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 3);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);
INSERT INTO coreschema.tests (points, task_id) VALUES (10, 4);

INSERT INTO coreschema.task_descriptions (task_id, alias, main, input_format,
output_format, explanation) VALUES (5, 'equal_sets', 'Вовчику дали особисте ' ||
 'завдання додому – написати програму, яка визначатиме, чи містить задана на вході послідовність із **_N_** цілих чисел **_a<sub>1</sub>_**, **_a<sub>2</sub>_**, ..., **_a<sub>N</sub>_**, що по модулю не перевищують **_2<sup>31</sup>-1_**, дві підмножини з однаковою сумою, які не перетинаються. Зрозуміло, що підмножини не порожні.', 'Перший рядок містить натуральне число **_N (N <= 25)_**.  \nДругий рядок містить _**N**_ цілих **_a<sub>1</sub>_**, **_a<sub>2</sub>_**, ..., **_a<sub>N</sub>_**, які задають початкову множину.', 'Виведіть **_YES_**, якщо існують такі дві підмножини, інакше виведіть **_NO_**.', Null);

INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data)
VALUES (5, 'equal_sets', '6\n1 3 5 12 20 -1', 'YES');