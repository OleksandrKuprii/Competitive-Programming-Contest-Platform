import json
from multiprocessing import Pool
from os import environ, getenv
from time import sleep

from toucan.runner.execution import worker


p = Pool(5)

while True:
    response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)

    if 'Messages' in response.keys():
        p.map(worker, filter(lambda x: x is not None, response['Messages']))

    sleep(20)