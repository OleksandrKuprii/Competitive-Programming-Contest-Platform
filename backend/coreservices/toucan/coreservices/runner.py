"""Module for accessing Toucan Runner VM."""
import asyncio

from toucan.dataclass import SubmissionToRunner

queue = asyncio.Queue()


async def add_submission(submission_to_runner: SubmissionToRunner):
    """Put submission into queue."""
    await queue.put(submission_to_runner)
