import docker
import boto3
from multiprocessing import Pool
from time import sleep
import json

client = docker.from_env()

queue_url = "http://localhost:4576/queue/submissions"


def worker(message):
    # body = json.loads(message['Body'])

    # print(body)

    print(message['Body'])

    sqs.delete_message(QueueUrl=queue_url,
                       ReceiptHandle=message['ReceiptHandle'])


sqs = boto3.client('sqs', endpoint_url='http://localhost:4576')

p = Pool(5)

while True:
    response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)

    if 'Messages' in response.keys():
        p.map(worker, filter(lambda x: x is not None, response['Messages']))

    sleep(20)
