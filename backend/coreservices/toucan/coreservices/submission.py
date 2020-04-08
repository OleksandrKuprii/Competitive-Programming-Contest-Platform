"""Handles submission logic."""
from typing import List

from toucan import database
from toucan import storage
from toucan.dataclass import (SubmissionToRunner, SubmissionToStorage,
                              UserSubmission)

from .runner import add_submission as runner_add_submission


async def add_submission(user_submission: UserSubmission):
    """Get submission from API and communicates with database and storage.

    Parameters
    ----------
    user_submission : UserSubmission
    """
    # Adds submission to database
    submission_id, task_id = await database.add_submission(user_submission)

    # Gets ids of all test for this task from database
    test_ids = await database.get_test_ids(task_id)

    # Creates SubmissionToStorage object
    submission_to_storage = SubmissionToStorage(submission_id,
                                                user_submission.code)

    # Adds code to the storage
    storage.add_code(submission_to_storage)

    # Gets limits for this task from database
    limits = await database.get_limits(task_id)
    wall_time_limit = limits['wall_time_limit']
    cpu_time_limit = limits['cpu_time_limit']
    memory_limit = limits['memory_limit']

    # Creates SubmissionToRunner object
    submission_to_runner = SubmissionToRunner(submission_id, test_ids,
                                              user_submission.lang,
                                              wall_time_limit, cpu_time_limit,
                                              memory_limit)

    # Asks runner to process submission
    await runner_add_submission(submission_to_runner)

    return submission_id


async def get_all(user_id: str, number: int, offset: int) -> dict:
    """Get {number} submissions from database for specific user.

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
    submissions: dict
        The dictionary of all submissions made by specific user
    """
    # Getting submissions from database
    submissions = await database.get_submissions(user_id, number, offset)

    for i in range(len(submissions)):
        # Getting result for each submission
        submissions[i]['result'] = \
            await get_result(submissions[i]['id'], user_id)

    return submissions


async def get_result(submission_id: int, user_id: str) -> dict:
    """Get result from database by submission and user id.

    Parameters
    ----------
    submission_id: int
        The id of submission
    user_id: str
        The id of user

    Returns
    -------
    _: dict
        The dictionary contains number of points and status of submission
    """
    # Getting result from database
    result = await database.get_result(submission_id, user_id)

    # If submission was checked and result is not full
    if result[0] != 100 and isinstance(result[1], list):
        if 'Correct' in result[1]:
            # Remove status correct from list of statuses
            result[1].remove('Correct')

    return {'points': result[0], 'status': result[1]}


async def get_test_results(submission_id: int, user_id: str) -> List[dict]:
    """Get results of tests for specific submission.

    Parameters
    ----------
    submission_id: int
        The id of submission
    user_id: str
        The id of user

    Returns
    -------
    tests: List[dict]
        The list of dictionaries, which represents each test
    """
    # Getting tests from database
    tests = await database.get_test_results(submission_id, user_id)

    return tests


async def get_submission(submission_id: int, user_id: str) -> dict:
    """Get submission from database by its id.

    Parameters
    ----------
    submission_id: int
        The id of the submission
    user_id: str
        The id of the user

    Returns
    -------
    submission: dict
        The dictionary represents info about this submission
    """
    # Getting submission from database
    submission = await database.get_submission(submission_id, user_id)

    # Getting result from current module
    result = await get_result(submission_id, user_id)

    submission['result'] = result

    # If submission is not checked, so points will be None
    if result['points'] is None:
        # Tests are empty
        tests = list()
    else:
        # Getting tests from current module
        tests = await get_test_results(submission_id, user_id)

    submission['tests'] = tests

    # Getting code from storage
    submission['code'] = storage.get_code(submission_id)

    return submission


async def get_submission_id_from_bests(user_id: str, task_id: int) -> int:
    """Get submission id from database by user and task id.

    Parameters
    ----------
    user_id: str
        The id of user
    task_id: int
        The id of task

    Returns
    -------
    _: int
        The id of the submission
    """
    return await database.get_submission_id_from_bests(user_id, task_id)
