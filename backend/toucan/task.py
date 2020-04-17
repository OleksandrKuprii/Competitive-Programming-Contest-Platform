"""Task module."""
from typing import List

import database
import submission


async def get_task_info(alias: str, conn) -> dict:
    """Get task details from database.

    Parameters
    ----------
    alias: str
        The alias of the task

    Returns
    -------
    _: dict
        Dictionary contains all task description, examples and limits
    """
    # Getting task info from database
    return await database.get_task(alias, conn)


async def get_tasks(user_id: str, number: int, offset: int, conn) \
        -> List[dict]:
    """Get task description.

    Get task description of {number} tasks and add personal result for
    each task for specific user.

    Parameters
    ----------
    user_id: str
        The id of user
    number: int
        The number of tasks to return
    offset: int
        The number of tasks to miss from start

    Returns
    -------
    tasks: List[dict]
        The list contains dictionaries, which represent task
    """
    # Getting the tasks from database
    tasks = await database.get_tasks(number, offset, conn)

    for i in range(len(tasks)):
        task_id = tasks[i].pop('id')

        # Getting submission id from database by user and task id
        submission_id = await database.get_submission_id_from_bests(
            user_id, task_id, conn)

        if submission_id is not None:
            # Getting result for specific task and user if its exists
            result = await submission.get_result(submission_id, user_id, conn)
        else:
            result = None

        tasks[i]['best_submission'] = {
            'result': result,
            'id': submission_id
        }

    return tasks


async def get_task_id_from_alias(alias: str, conn) -> int:
    """Get user id from alias.

    Parameters
    ----------
    alias: str
        The alias of the task

    Returns
    -------
    task_id: int
        Task id
    """
    task_id = await database.get_task_id_from_alias(alias, conn)

    return task_id
