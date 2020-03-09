"""Actual Toucan Runner logic."""
import json
import os
import tempfile
from multiprocessing import Pool
from time import sleep

import boto3

import docker

import toucan.storage
from toucan.dataclass import ResultToChecker, SubmissionToRunner, TestResult

client = docker.from_env()

sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

queue = sqs.get_queue_by_name(QueueName='submissions')

lang_to_image = {'python3': 'python:3.8-alpine'}


def worker(submission_to_runner):
    """Execute submission."""
    print('started')

    sleep(10)

    image = lang_to_image[submission_to_runner.lang]

    path = toucan.storage.download_submission_code(
        submission_to_runner.submission_id, submission_to_runner.lang)

    filename = os.path.basename(path)

    path = os.path.abspath(path)

    results = []

    for i, input_path in enumerate(toucan.storage.download_inputs(
                                    submission_to_runner.test_ids)):
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
                TestResult(submission_to_runner.test_ids[i], 'Killed', None))

        container.remove()

    result_to_checker = ResultToChecker(submission_to_runner.submission_id,
                                        results)

    print(result_to_checker)


def main():
    """Act like runner enter point."""
    p = Pool(5)

    while True:
        messages = queue.receive_messages(MaxNumberOfMessages=10)

        submissions_to_runner = []

        for message in messages:
            body = json.loads(message.body)

            submission_to_runner = SubmissionToRunner(**body)

            submissions_to_runner.append(submission_to_runner)

            message.delete()

        p.map(worker, submissions_to_runner)

        sleep(20)


if __name__ == '__main__':
    main()
