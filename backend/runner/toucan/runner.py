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

queue_url = os.getenv('SUBMISSIONS_QUEUE_URL')

sqs = boto3.client('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

lang_to_image = {'python3': 'python:3.8-alpine'}


def worker(message):
    """Execute submission."""
    try:
        body = json.loads(message['Body'])

        submission_to_runner = SubmissionToRunner(**body)

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
    finally:
        sqs.delete_message(QueueUrl=queue_url,
                           ReceiptHandle=message['ReceiptHandle'])


def main():
    """Act like runner enter point."""
    p = Pool(5)

    while True:
        response = sqs.receive_message(QueueUrl=queue_url,
                                       MaxNumberOfMessages=10)

        if 'Messages' in response.keys():
            p.map(worker, filter(lambda x: x is not None,
                                 response['Messages']))

        sleep(20)


if __name__ == '__main__':
    main()
