"""Runner entrypoint."""
import asyncio
import concurrent.futures
import json
import os

import boto3

import toucan.database
import toucan.runner.worker
from toucan.dataclass import SubmissionToRunner

SUBMISSIONS_QUEUE_URL = os.getenv('SUBMISSIONS_QUEUE_URL')

assert SUBMISSIONS_QUEUE_URL is not None


async def main():
    """Run runner."""
    await toucan.database.establish_connection_from_env()

    sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

    queue = sqs.Queue(url=SUBMISSIONS_QUEUE_URL)

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)

    while True:
        messages = queue.receive_messages(WaitTimeSeconds=20)

        if messages:
            submission_to_runner = map(
                lambda message: SubmissionToRunner(**json.loads(message.body)),
                messages)

            for message in messages:
                message.delete()

            for result_to_checker in executor.map(
                    toucan.runner.worker.process_submission_to_runner,
                    submission_to_runner):
                await toucan.checker.process_result_to_checker(
                    result_to_checker)


if __name__ == '__main__':
    asyncio.run(main())
