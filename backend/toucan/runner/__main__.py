"""Runner entry point."""
import asyncio
import concurrent.futures
import json
import logging
import os

import aioboto3
import docker

from dataclass import SubmissionToRunner
from runner import worker

SUBMISSIONS_QUEUE_URL = os.getenv('SUBMISSIONS_QUEUE_URL')

assert SUBMISSIONS_QUEUE_URL is not None

logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')

# Set up docker client
client = docker.from_env()


async def main():
    """Run runner."""
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

                        logging.info(f'#{submission_id} Received')

                except TypeError:
                    return

                # Each message should be removed from queue
                for message in messages:
                    await message.delete()

                loop = asyncio.get_event_loop()

                for submission in submission_to_runner:
                    loop.run_in_executor(
                        executor, worker.process_submission_to_runner,
                        submission, client)
                # [loop.run_in_executor(executor,
                #  worker.process_submission_to_runner, i) for i in
                #  submission_to_runner]


async def pull_images(client: docker.DockerClient) -> None:
    """Pull all docker images before start of the runner.

    Parameters
    ----------
    client: docker.DockerClient
        The client for docker
    """
    # All necessary images
    images = ['python:3.8-slim', 'python:2.7-slim', 'gcc:9.3.0']

    for image in images:
        # Pull image
        client.images.pull(image)

        print(f'Pulled {image}')


if __name__ == '__main__':
    print('Runner is starting...')
    print('------------------')
    print('Pulling images...')

    # Pull all docker images before start
    asyncio.run(pull_images(client))

    print('----------------------')
    print("All images were pulled")
    print("======== Runner started! ========")

    # Start runner
    asyncio.run(main())
