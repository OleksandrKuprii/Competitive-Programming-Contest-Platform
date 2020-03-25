"""Handles submission logic."""
from toucan import database
from toucan.dataclass import (SubmissionToRunner, SubmissionToStorage,
                              UserSubmission)
from toucan.storage import add_code

from .runner import add_submission as runner_add_submission


async def add_submission(user_submission: UserSubmission) -> None:
    """Get submission from API and communicates with database and storage.

    Parameters
    ----------
    user_submission : UserSubmission
    """
    # Adds submission to database
    submission_id = await database.db_add_submission(user_submission)

    # Gets ids of all test for this task from database
    test_ids = await database.get_test_ids(user_submission.task_id)

    # Creates SubmissionToStorage object
    submission_to_storage = SubmissionToStorage(submission_id,
                                                user_submission.code)

    # Adds code to the storage
    add_code(submission_to_storage)

    # Gets limits for this task from database
    limits = await database.get_limits(user_submission.task_id)
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


async def get_result(submission_id: int):
    """Get result from database service."""
    result = await database.get_result(submission_id)
    return {'points': result[0], 'status': result[1]}
