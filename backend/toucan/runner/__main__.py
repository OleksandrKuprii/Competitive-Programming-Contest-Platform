"""Runner enter point."""
import asyncio
import logging

import aioboto3
import os
import json
from queue import Queue
from threading import Thread

from dataclass import SubmissionToRunner, TestToWorker
import storage
from runner.worker import worker
from runner.configs import compiler_configs
from runner.compiler import compile, compilation_error
from env import resource, submissions_queue_url


logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')

completed_tests = {}


async def main():
    """Start runner."""
    # pull_all(['fpc'])

    queue = Queue()

    for _ in range(5):
        Thread(target=worker, args=(queue,completed_tests)).start()

    async with resource('sqs') as sqs:
        submission_queue = await sqs.Queue(submissions_queue_url)

        while True:
            messages = await submission_queue.receive_messages(WaitTimeSeconds=20)

            if messages:
                for message in messages:
                    submission_to_runner = SubmissionToRunner(**json.loads(await message.body))

                    id = submission_to_runner.submission_id
                    lang = submission_to_runner.lang

                    submission_code_path = await storage.download_submission_code(id, lang)

                    completed_tests[id] = len(submission_to_runner.test_ids)

                    compiler_config = compiler_configs[lang]

                    volume = None

                    if compiler_config.is_compilable:
                        volume = await compile(submission_code_path, compiler_config)

                        logging.info(f'#{id} Compiled')

                        if volume is None:
                            await compilation_error(id, submission_to_runner.test_ids)
                            logging.info(f'#{id} Compilation error')
                            continue

                    for test_id in submission_to_runner.test_ids:
                        queue.put(TestToWorker(
                            submission_id=id,
                            submission_code_path=submission_code_path,
                            test_id=test_id,
                            lang=lang,
                            wall_time_limit=submission_to_runner.wall_time_limit,
                            cpu_time_limit=submission_to_runner.cpu_time_limit,
                            memory_limit=submission_to_runner.memory_limit,
                            volume=volume
                        ))

                for message in messages:
                    await message.delete()


if __name__ == "__main__":
    asyncio.run(main())
