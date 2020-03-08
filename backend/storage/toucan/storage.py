"""Handles storage logic."""
import os
from typing import Iterable

import boto3

from toucan.dataclass import SubmissionToStorage

SUBMISSIONS_BUCKET = 'submissions'
TESTS_BUCKET = 'tests'

LOCAL_STORAGE_ROOT = os.getenv('LOCAL_STORAGE_ROOT')

assert LOCAL_STORAGE_ROOT is not None

S3_ENDPOINT = os.getenv('S3_ENDPOINT')

assert S3_ENDPOINT is not None

s3 = boto3.resource('s3', endpoint_url=S3_ENDPOINT)


def get_correct_results(test_ids: Iterable[int]) -> Iterable[str]:
    """Return correct results for given test ids.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    tests_ids: Iterable[int] - test ids
    """
    for test_id in test_ids:
        obj = s3.Object(TESTS_BUCKET, f'{test_id}.output')
        yield obj.get()['Body'].read()


def download_inputs(test_ids: Iterable[int]) -> Iterable[str]:
    """Download inputs for given test ids and return their paths.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    tests_ids: Iterable[int] - test ids
    """
    for test_id in test_ids:
        path = f'{LOCAL_STORAGE_ROOT}/tests/{test_id}.input'

        s3.Bucket(TESTS_BUCKET).download_file(f'{test_id}.input', path)

        yield path


def add_code(submission_to_storage: SubmissionToStorage):
    """Add submission code to storage.

    Uploads object to S3 bucket.

    Parameters
    ----------
    submission_to_storage: SubmissionToStorage - code and submission_id
    """
    obj = s3.Object(SUBMISSIONS_BUCKET,
                    str(submission_to_storage.submission_id))
    obj.put(Body=submission_to_storage.code)


def download_submission_code(submission_id: int, lang: str) -> str:
    """Download submission code and return path to local file."""
    ext = None

    if lang in ('python3', 'python2'):
        ext = 'py'

    assert ext is not None

    path = f'{LOCAL_STORAGE_ROOT}/submissions/{submission_id}.{ext}'

    print(path)

    s3.Bucket(SUBMISSIONS_BUCKET).download_file(str(submission_id), path)

    return path
