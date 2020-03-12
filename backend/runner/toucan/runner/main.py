import multiprocessing as mp
import json
import os

import toucan.runner.worker

import boto3

import typing

from toucan.dataclass import SubmissionToRunner


def start_workers(execution_queue, n: int):
    for i in range(n):
        mp.Process(target=toucan.runner.worker.worker,
                   args=(execution_queue, )).start()


def poll_sqs_queue(
        queue,
        wait_time=20) -> typing.Generator[SubmissionToRunner, None, None]:
    messages = queue.receive_messages(MaxNumberOfMessages=10,
                                      WaitTimeSeconds=wait_time)

    for message in messages:
        body = json.loads(message.body)

        submission_to_runner = SubmissionToRunner(**body)

        print(submission_to_runner)

        yield submission_to_runner

        message.delete()


def poll_sqs_queue_forever(queue, wait_time=20):
    while True:
        for submisssion_to_runner in poll_sqs_queue(queue, wait_time):
            yield submisssion_to_runner


def poll_sqs_queue_forever_to_execution_queue(queue,
                                              execution_queue,
                                              wait_time=20):
    for submission_to_runner in poll_sqs_queue_forever(queue, wait_time):
        execution_queue.put(submission_to_runner)


if __name__ == "__main__":
    sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

    queue = sqs.Queue(url=os.getenv('SUBMISSIONS_QUEUE_URL'))

    execution_queue = mp.Queue()

    mp.Process(target=poll_sqs_queue_forever_to_execution_queue,
               args=(queue, execution_queue)).start()

    start_workers(execution_queue, 5)

    print('Started!')
