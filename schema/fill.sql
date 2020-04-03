INSERT INTO coreschema.tasks (alias, name, category, difficulty,
wall_time_limit,
cpu_time_limit,
memory_limit) VALUES ('comics', 'Комікси', NULL, 1, 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, category, difficulty,
wall_time_limit,
cpu_time_limit,
memory_limit) VALUES ('coins', 'Монети', NULL, 2, 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, category, difficulty,
wall_time_limit,
cpu_time_limit,
memory_limit) VALUES ('stamps', 'Марки', NULL, 4, 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, category, difficulty,
wall_time_limit,
cpu_time_limit,
memory_limit) VALUES ('wrappers', 'Фантики', NULL, 6, 1000, 1000, 256);
INSERT INTO coreschema.tasks (alias, name, category, difficulty, wall_time_limit,
cpu_time_limit,
memory_limit) VALUES ('equal_sets', 'Однакові підмножини', 'Sth', 8, 1000,
1000, 256);

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

INSERT INTO coreschema.task_descriptions (task_id, alias, main, input_format, output_format, explanation) VALUES (1, 'comics', 'Ярослав і Мирослава колекціонують комікси. Ярослав має **_a_** коробок по **_n_** коміксів у кожній та **_b_** коробок по **_m_** коміксів у кожній, а Мирослава — **_a_** коробок по **_m_** коміксів у кожній та **_b_** коробок по **_n_** коміксів у кожній. У кого з дітей коміксів більше?', 'У вхідному файлі через пробіл вказано чотири числа: **_a_**, **_b_**, **_n_** та **_m_** (саме в такому порядку). Усі чотири числа натуральні та не перевищують 10 000.', 'У вихідний файл виведіть 1, якщо більшу кількість коміксів має Ярослав; 2, якщо більше коміксів у Мирослави; 0, якщо Ярослав та Мирослава мають однакову кількість коміксів.', 'Ярослав має 2 × 5 + 3 × 4 = 22 комікси, а Мирослава — 2 × 4 + 3 × 5 = 23 комікси, тобто на один комікс більше, ніж Ярослав.');
INSERT INTO coreschema.task_descriptions (task_id, alias, main, input_format, output_format, explanation) VALUES (2, 'coins', 'Ярослав та Мирослава мають спільну колекцію з **_n_** монет. Як символ своєї дружби вони хочуть окремо зберігати таку пару монет, що в сумі номінальна вартість цих двох монет дає особливе число **_s_**. Підрахуйте кількість різних способів вибрати потрібну пару.', 'У першому рядку вхідного файлу вказано натуральні числа **_s_** та **_n_**, не менші за 2. У другому рядку записано **_n_** натуральних чисел — номінальні вартості монет із колекції. Усі числа у вхідному файлі (включно з числами **_s_** та **_n_**) не перевищують 200 000.', 'У вихідний файл виведіть єдине число — кількість способів вибрати дві монети з сумарною номінальною вартістю **_s_**. Відомо, що шукана кількість не перевищує 10<sup>9</sup>.', 'У першому прикладі діти можуть вибрати пару в один із чотирьох способів: взяти першу і другу монети; або першу й четверту; або другу й четверту; або третю та п’яту.\n\nУ другому прикладі жодні дві монети, на жаль, не дають у сумі вартість 10.');
INSERT INTO coreschema.task_descriptions (task_id, alias, main, input_format, output_format, explanation) VALUES (3, 'stamps', 'Нещодавно на уроці математики Ярослав і Мирослава вивчили, що арифметичною прогресією називають послідовність чисел, у якій різниця між кожними двома сусідніми членами однакова. А невдовзі після того діти дізналися, що на честь ювілею математичного товариства столиці було випущено дві серії марок. Кожна серія складається з **_n_** марок різної номінальної вартості, і ці **_n_** номіналів утворюють арифметичну прогресію. Для своєї колекції марок Ярослав придбав одну з цих серій, а Мирослава — іншу. Однак, роздивляючись придбання одне одного, діти ненароком перемішали всі марки.\n\nЗнаючи номінали марок — 2**_n_** попарно різних чисел, — допоможіть дітям розділити марки на дві серії. Відомо, що це можна зробити рівно в один спосіб.', 'У першому рядку вхідного файлу вказано натуральне число **_n_** — кількість марок у серії, 3 ⩽ **_n_** ⩽ 100 000. У другому рядку записано 2**_n_** різних натуральних чисел, менших за 10<sup>9</sup>, — перемішані номінали марок.', 'У перший рядок вихідного файлу виведіть в порядку зростання всі номінали марок Ярославової серії, а в другий рядок — усі номінали марок Мирославиної серії (так само в порядку зростання). Діти пам’ятають, що найдешевша марка Ярослава має менший номінал, ніж найдешевша марка Мирослави.', 'Виведені у вихідний файл послідовності утворюють шукані серії марок, адже є арифметичними прогресіями: 9 − 2 = 16 − 9 = 23 − 16 та 7 − 3 = 11 − 7 = 15 − 11. Серії виведено в правильному порядку, бо 2 < 3.');
INSERT INTO coreschema.task_descriptions (task_id, alias, main, input_format, output_format, explanation) VALUES (4, 'wrappers', 'За останній час Ярослав і Мирослава назбирали разом **_n_** фантиків. Як відомо, кожен колекціонер прагне, щоб його колекція була максимально розмаїтою. Тому діти хочуть розподілити між собою фантики так, щоб жодні два чимось схожих між собою фантики не потрапили до одного власника. Для цього Ярослав та Мирослава занумерували фантики числами від 1 до **_n_** та виписали, які саме пари фантиків виглядають подібно. Усього в них вийшло **_m_** пар, причому номери деяких фантиків могли бути виписані в кількох різних парах.\n\nДопоможіть дітям розподілити фантики бажаним чином або визначте, що це неможливо.', 'У першому рядку вхідного файлу вказано два натуральних числа 𝑛 та 𝑚 — кількість фантиків та кількість їх подібних пар; 2 ⩽ **_n_** < 2000, 1 ⩽ **_m_** < 450 000. У кожному з наступних **_m_** рядків задано по два числа **_a<sub>i</sub>_** а **_b<sub>i</sub>_** — номери схожих між собою фантиків, 1 ⩽ **_a<sub>i</sub>_** **_< b<sub>i</sub>_** ⩽ **_n_**, 1 ⩽ **_i_** ⩽ **_m_**. Жодна пара номерів **_a<sub>i</sub>_**, **_b<sub>i</sub>_** у вхідному файлі не повторюється. Крім того, вхідні дані гарантують, що є не більше ніж один спосіб розподілити фантики між дітьми, щоб жодні два схожих між собою фантики не опинилися в одного власника.', 'У першому рядку вихідного файлу виведіть у порядку зростання номери фантиків, які мають опинитися в того ж власника, що й фантик під номером 1 (включно з самим числом 1 ). У другому рядку виведіть у порядку зростання номери фантиків, які повинні опинитися в іншого власника.\n\nЯкщо жоден розподіл фантиків не задовольняє умову задачі, в обох рядках виведіть по нулю.', null);

INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (1, 'comics', '2 3 5 4', '2');
INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (2, 'coins', '4 5\n2 2 3 2 1', '4');
INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (2, 'coins', '10 3\n6 2 10', '0');
INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (3, 'stamps', '4\n7 9 23 3 16 15 11 2', '2 9 16 23\n3 7 11 15');
INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (4, 'wrappers', '5 6\n2 5\n2 3\n1 5\n4 5\n3 4\n1 3', '1 2 4\n3 5');
INSERT INTO coreschema.task_examples (task_id, alias, input_data, output_data) VALUES (4, 'wrappers', '3 3\n1 2\n2 3\n1 3', '0\n0');