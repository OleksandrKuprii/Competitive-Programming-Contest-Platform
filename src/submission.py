import asyncio

from src.database import add_submission as db_add_submission
from src.database import get_limits, get_test_ids
from src.dataclass import (SubmissionToRunner, SubmissionToStorage)
from src.runner import add_submission as runner_add_submission
from src.storage import add_code


async def add_submission(user_submission):
    submission_id = await db_add_submission(user_submission)

    submission_id = submission_id[0]['id']

    test_ids = await get_test_ids(user_submission.task_id)

    submission_to_storage = SubmissionToStorage(submission_id,
                                                user_submission.lang,
                                                user_submission.code)
    add_code(submission_to_storage)

    limits = await get_limits(user_submission.task_id)

    wall_time_limit = limits[0]['wall_time_limit']
    cpu_time_limit = limits[0]['cpu_time_limit']
    memory_limit = limits[0]['memory_limit']

    submission_to_runner = SubmissionToRunner(submission_id, test_ids,
                                              user_submission.lang,
                                              user_submission.code,
                                              wall_time_limit,
                                              cpu_time_limit,
                                              memory_limit)

    await runner_add_submission(submission_to_runner)
