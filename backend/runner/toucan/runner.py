"""Actual Toucan Runner logic."""
import json
from multiprocessing import Pool
from os import getenv
from time import sleep

import boto3

import docker

from toucan.dataclass import SubmissionToRunner

client = docker.from_env()

queue_url = getenv('SUBMISSIONS_QUEUE_URL')

sqs = boto3.client('sqs', endpoint_url=getenv('SQS_ENDPOINT'))


def worker(message):
    """Execute submission."""
    body = json.loads(message['Body'])

    submission_to_runner = SubmissionToRunner(**body)

    print(submission_to_runner)

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
