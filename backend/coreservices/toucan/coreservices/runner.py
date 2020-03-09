"""Module for accessing Toucan Runner VM."""
import os

import boto3

from toucan.dataclass import SubmissionToRunner

sqs = boto3.resource('sqs')

queue_url = os.getenv('SUBMISSIONS_QUEUE_URL')

assert queue_url is not None

queue = sqs.Queue(queue_url)


async def add_submission(submission_to_runner: SubmissionToRunner):
    """Put submission into queue."""
