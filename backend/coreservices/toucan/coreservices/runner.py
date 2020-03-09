"""Module for accessing Toucan Runner VM."""
import dataclasses
import json
import os

import boto3

from toucan.dataclass import SubmissionToRunner

sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

queue = sqs.get_queue_by_name(QueueName='submissions')


async def add_submission(submission_to_runner: SubmissionToRunner):
    """Put submission into queue."""
    queue.send_message(
        MessageBody=json.dumps(dataclasses.asdict(submission_to_runner)))
