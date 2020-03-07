from toucan.dataclass import SubmissionToRunner
import json
from multiprocessing import Pool
from os import environ, getenv
from time import sleep

import docker
import boto3

client = docker.from_env()

queue_url = getenv('SUBMISSIONS_QUEUE_URL')

sqs = boto3.client('sqs', endpoint_url=getenv('SQS_ENDPOINT'))

def worker(message):
    body = json.loads(message['Body'])

    submission_to_runner = SubmissionToRunner(**body)

    print(submission_to_runner)

    sqs.delete_message(QueueUrl=queue_url,
                       ReceiptHandle=message['ReceiptHandle'])

def main():
    p = Pool(5)

    while True:
        response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)

        if 'Messages' in response.keys():
            p.map(worker, filter(lambda x: x is not None, response['Messages']))

        sleep(20)