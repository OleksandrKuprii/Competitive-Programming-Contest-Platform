"""Handles submission logic."""
from toucan import database
from toucan import storage
from toucan.dataclass import (SubmissionToRunner, SubmissionToStorage,
                              UserSubmission)

from .runner import add_submission as runner_add_submission


async def add_submission(user_submission: UserSubmission) -> None:
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


async def get_all(user_id, number, offset):
    """Get all submissions."""
    submissions = await database.get_submissions(user_id, number, offset)

    for i in range(len(submissions)):
        submissions[i]['result'] = await get_result(submissions[i]['id'])

    return submissions


async def get_result(submission_id: int):
    """Get result from database service."""
    result = await database.get_result(submission_id)
    return {'points': result[0], 'status': result[1]}


async def get_test_results(submission_id: int) -> None:
    """Get all test results."""
    tests = await database.get_test_results(submission_id)
    return tests


async def get_submission(submission_id: int):
    """Get submission from database service by id."""
    submission_dict = await database.get_submission(submission_id)

    result = await get_result(submission_id)

    if result['points'] is None:
        tests = list()
    else:
        tests = await get_test_results(submission_id)

    submission_dict['tests'] = tests

    code = storage.get_code(submission_id)
    submission_dict['code'] = code

    return submission_dict


async def get_submission_id_from_bests(user_id: int, task_id: int):
    return await database.get_submission_id_from_bests(user_id, task_id)

