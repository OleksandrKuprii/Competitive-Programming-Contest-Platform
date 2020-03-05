from toucan.dataclass import SubmissionToRunner

import docker

client = docker.from_env()

queue_url = getenv('SUBMISSIONS_QUEUE_URL')

sqs = boto3.client('sqs', endpoint_url=getenv('SQS_ENDPOINT'))

def worker(message):
    body = json.loads(message['Body'])

    submission_to_runner = SubmissionToRunner(**body)

    print(submission_to_runner)

    sqs.delete_message(QueueUrl=queue_url,
                       ReceiptHandle=message['ReceiptHandle'])
