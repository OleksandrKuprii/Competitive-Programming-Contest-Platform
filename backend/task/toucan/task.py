"""Task module."""
from markdown2 import markdown

from toucan.database import get_task, get_tasks as db_get_tasks


async def get_task_info(alias):
    """Task."""
    task_info = dict()
    task_from_db = await get_task(alias)

    if task_from_db is None:
        return None

    task_info['real_time_limit'] = task_from_db[0][0]
    task_info['cpu_time_limit'] = task_from_db[0][1]
    task_info['memory_limit'] = task_from_db[0][2]

    task_info['description'] = markdown(task_from_db[0][3])
    task_info['input_format'] = markdown(task_from_db[0][4])
    task_info['output_format'] = markdown(task_from_db[0][5])

    if task_from_db[0][6] is not None:
        task_info['explanation'] = markdown(task_from_db[0][6])

    examples = []
    for example in task_from_db[1:]:
        examples.append({'input': example[0], 'output': example[1]})

    task_info['examples'] = examples

    return task_info


async def get_tasks(user_id, number, offset):
    """Get tasks."""
    tasks = await db_get_tasks(user_id, number, offset)

    tasks_dict = list()

    for x in tasks:
        d = {k: v for k, v in x}
        tasks_dict.append(d)

    return tasks_dict