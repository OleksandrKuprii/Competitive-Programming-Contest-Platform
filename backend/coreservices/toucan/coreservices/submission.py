from toucan.database import add_submission as db_add_submission
from toucan.database import get_limits, get_test_ids
from toucan.dataclass import SubmissionToRunner, SubmissionToStorage, UserSubmission
from .runner import add_submission as runner_add_submission
from toucan.storage import add_code


async def add_submission(user_submission: UserSubmission) -> None:
    """Gets submission from API and communicates with database and
    storage

    Parameters
    ----------
    user_submission : UserSubmission
    """

    # Adding submission to database
    submission_id = await db_add_submission(user_submission)

    # Getting ids of all test for this task from database
    test_ids = await get_test_ids(user_submission.task_id)

    # Creating SubmissionToStorage object
    submission_to_storage = SubmissionToStorage(submission_id,
                                                user_submission.lang,
                                                user_submission.code)

    # Adding code to the storage as file
    add_code(submission_to_storage)

    # Getting limits for this task from database
    limits = await get_limits(user_submission.task_id)
    wall_time_limit = limits['wall_time_limit']
    cpu_time_limit = limits['cpu_time_limit']
    memory_limit = limits['memory_limit']

    # Creating SubmissionToRunner object
    submission_to_runner = SubmissionToRunner(submission_id, test_ids,
                                              user_submission.lang,
                                              user_submission.code,
                                              wall_time_limit, cpu_time_limit,
                                              memory_limit)

    # Asking runner to compile and run this code
    await runner_add_submission(submission_to_runner)
