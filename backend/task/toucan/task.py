"""Task module."""
from markdown2 import markdown

from toucan import database
from toucan.coreservices import submission


async def get_task_info(alias):
    """Task."""
    task_info = await database.get_task(alias)

    for x in ['main', 'input_format', 'output_format', 'explanation']:
        if task_info[x] is not None:
            task_info[x] = markdown(task_info[x])

    return task_info


async def get_tasks(user_id: str, number: int, offset: int):
    """Get tasks."""
    tasks = await database.get_tasks(number, offset)

    for i in range(len(tasks)):
        task_id = tasks[i].pop('id')
        submission_id = await database.get_submission_id_from_bests(
            user_id, task_id)

        if submission_id is not None:
            result = await submission.get_result(submission_id, user_id)
        else:
            result = None

        tasks[i]['best_submission'] = {
            'result': result,
            'id': submission_id
        }

    return tasks


async def get_task_id_from_alias(alias: str) -> int:
    """Get user id from alias."""
    return await database.get_task_id_from_alias(alias)
