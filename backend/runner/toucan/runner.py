"""Actual Toucan Runner logic."""
import json
import multiprocessing as mp
import os
import tempfile
import time

import boto3

import docker

import toucan.storage
from toucan.dataclass import ResultToChecker, SubmissionToRunner, TestResult

client = docker.from_env()

sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

queue = sqs.get_queue_by_name(QueueName='submissions')

lang_to_image = {'python3': 'python:3.8-alpine'}

worker_queue = mp.Queue()


def worker():
    """Execute submission."""
    while True:
        try:
            submission_to_runner = worker_queue.get()
        except Exception:
            time.sleep(5)
            continue

        print(submission_to_runner)

        image = lang_to_image[submission_to_runner.lang]

        path = toucan.storage.download_submission_code(
            submission_to_runner.submission_id, submission_to_runner.lang)

        filename = os.path.basename(path)

        path = os.path.abspath(path)

        results = []

        for i, input_path in enumerate(
                toucan.storage.download_inputs(submission_to_runner.test_ids)):
            tmpfile, tmpfilename = tempfile.mkstemp()

            container = client.containers.run(
                image,
                f'sh -c "cd /usr/app; ulimit -t 1; python3 ./{filename}"',
                network_disabled=True,
                detach=True,
                volumes={
                    path: {
                        'bind': f'/usr/app/{filename}',
                        'ro': True
                    },
                    os.path.abspath(input_path): {
                        'bind': f'/usr/app/input.txt',
                        'ro': True
                    },
                    tmpfilename: {
                        'bind': f'/usr/app/output.txt',
                        'ro': False
                    }
                },
                mem_limit=f'{submission_to_runner.memory_limit}M')

            result = container.wait()

            if result['StatusCode'] == 0:
                with os.fdopen(tmpfile, 'r') as tmpfile_file:
                    results.append(
                        TestResult(submission_to_runner.test_ids[i], 'Success',
                                   tmpfile_file.read()))
            elif result['StatusCode'] == 137:
                results.append(
                    TestResult(submission_to_runner.test_ids[i], 'Killed',
                               None))

            container.remove()

        result_to_checker = ResultToChecker(submission_to_runner.submission_id,
                                            results)

        print(result_to_checker)


def main():
    """Act like runner entry point."""
    for _ in range(5):
        mp.Process(target=worker).start()

    while True:
        messages = queue.receive_messages(MaxNumberOfMessages=10,
                                          WaitTimeSeconds=20)

        for message in messages:
            body = json.loads(message.body)

            submission_to_runner = SubmissionToRunner(**body)

            worker_queue.put(submission_to_runner)

            message.delete()


if __name__ == '__main__':
    main()
