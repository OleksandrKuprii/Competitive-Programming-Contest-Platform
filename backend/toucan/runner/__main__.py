"""Runner entry point."""
import asyncio
import concurrent.futures
import json
import logging
import os

import aioboto3

from toucan import checker
from toucan import database
from toucan.dataclass import SubmissionToRunner
from toucan.runner import worker

SUBMISSIONS_QUEUE_URL = os.getenv('SUBMISSIONS_QUEUE_URL')

assert SUBMISSIONS_QUEUE_URL is not None

logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


async def main():
    """Run runner."""
    await database.establish_connection_from_env()

    # Aioboto3 resource for Amazon SQS
    async with aioboto3.resource('sqs', endpoint_url=os.getenv(
            'SQS_ENDPOINT')) \
            as sqs:

        # Submissions queue object mapping
        queue = await sqs.Queue(url=SUBMISSIONS_QUEUE_URL)

        # Executor
        # Used for concurrent execution of submissions
        # One submission - one executor (e.g. worker)
        # max_workers - maximum number of submissions can be executed
        # Test execution is synchronous per worker
        executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)

        while True:
            # Poll queue
            # Maximum wait time is 20 seconds
            messages = await queue.receive_messages(WaitTimeSeconds=20)

            # If no messages were in queue
            # variable is an empty list.
            # Skips it in that case
            if messages:
                try:
                    # Message in submission queue is actually
                    # a json representation
                    # of SubmissionToRunner dataclass
                    submission_to_runner = [SubmissionToRunner(**json.loads(
                        await message.body)) for message in messages]

                    for message in messages:
                        submission_id = json.loads(await message.body)[
                            'submission_id']

                        # Changing submission status in the database to
                        # 'Running'
                        await database.change_submission_status(submission_id,
                                                                'Running')

                        logging.info(f'#{submission_id} Received')

                except TypeError:
                    return

                # Each message should be removed from queue
                for message in messages:
                    await message.delete()

                loop = asyncio.get_event_loop()

                tasks = [loop.run_in_executor(executor,
                         worker.process_submission_to_runner, i) for i in
                         submission_to_runner]

                completed, pending = await asyncio.wait(tasks)
                submission_result = [x.result() for x in completed]

                # Submission result
                # Use executor.map as it controls number of running submissions
                # submission_result = executor.map(
                #     worker.process_submission_to_runner,
                #     submission_to_runner)

                # Process results
                for result_to_checker in submission_result:
                    await checker.process_result_to_checker(result_to_checker)


if __name__ == '__main__':
    print('Runner is starting!')
    asyncio.run(main())
