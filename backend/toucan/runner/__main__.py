"""Runner enter point."""
import asyncio
import aioboto3
import os
import json
from queue import Queue
from threading import Thread
from dataclass import SubmissionToRunner, TestToWorker
import storage
from runner.worker import worker


completed_tests = {}


async def main():
    """Start runner."""
    queue = Queue()

    for _ in range(5):
        Thread(target=worker, args=(queue,completed_tests)).start()

    async with aioboto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT')) as sqs:
        submission_queue = await sqs.Queue(os.getenv('SUBMISSIONS_QUEUE_URL'))

        while True:
            messages = await submission_queue.receive_messages(WaitTimeSeconds=20)

            if messages:
                for message in messages:
                    submission_to_runner = SubmissionToRunner(**json.loads(await message.body))

                    id = submission_to_runner.submission_id
                    lang = submission_to_runner.lang

                    submission_code_path = await storage.download_submission_code(id, lang)

                    completed_tests[id] = len(submission_to_runner.test_ids)

                    for test_id in submission_to_runner.test_ids:
                        queue.put(TestToWorker(
                            submission_id=id,
                            submission_code_path=submission_code_path,
                            test_id=test_id,
                            lang=lang,
                            wall_time_limit=submission_to_runner.wall_time_limit,
                            cpu_time_limit=submission_to_runner.cpu_time_limit,
                            memory_limit=submission_to_runner.memory_limit,
                        ))

                for message in messages:
                    await message.delete()


if __name__ == "__main__":
    asyncio.run(main())
