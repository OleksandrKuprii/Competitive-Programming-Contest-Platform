"""Runner entry point."""
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

    # Boto3 resource for Amazon SQS
    sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

    # Submissions queue object mapping
    queue = sqs.Queue(url=SUBMISSIONS_QUEUE_URL)

    # Executor
    # Used for concurrent execution of submissions
    # One submission - one executor (e.g. worker)
    # max_workers - maximum number of submissions can be executed
    # Test execution is synchronous per worker
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)

    while True:
        # Poll queue
        # Maximum wait time is 20 seconds
        messages = queue.receive_messages(WaitTimeSeconds=20)

        # If no messages were in queue
        # variable is an empty list.
        # Skips it in that case
        if messages:
            try:
                # Message in submission queue is actually
                # a json representation
                # of SubmissionToRunner dataclass
                submission_to_runner = map(
                    lambda message: SubmissionToRunner(
                        **json.loads(message.body)),
                    messages)
            except TypeError:
                return

            # Each message should be removed from queue
            for message in messages:
                message.delete()

            # Submission result
            # Use executor.map as it controls number of running submissions
            submission_result = executor.map(
                toucan.runner.worker.process_submission_to_runner,
                submission_to_runner)

            # Process results
            for result_to_checker in submission_result:
                await toucan.checker.process_result_to_checker(
                    result_to_checker)


if __name__ == '__main__':
    asyncio.run(main())
