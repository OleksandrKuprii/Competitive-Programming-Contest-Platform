"""Handles storage logic."""
import os
import json

import aioboto3

from dataclass import SubmissionToStorage


SUBMISSIONS_BUCKET = 'submissions'
TESTS_BUCKET = 'tests'
TASKS_BUCKET = 'tasks'

LOCAL_STORAGE_ROOT = os.getenv('LOCAL_STORAGE_ROOT')

assert LOCAL_STORAGE_ROOT is not None

S3_ENDPOINT = os.getenv('LOCALSTACK_EDGE')

assert S3_ENDPOINT is not None


async def get_correct_result(test_id: int) -> str:
    """Return correct results for given test ids.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    test_id: int - test id
    """
    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        obj = await s3.Object(TESTS_BUCKET, f'{test_id}.output')

        obj_body = (await obj.get())['Body']

        return await obj_body.read()


async def download_input(test_id: int) -> str:
    """Download inputs for given test ids and return their paths.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    test_id: int - test id
    """
    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        path = f'{LOCAL_STORAGE_ROOT}/tests/{test_id}.input'

        await(await s3.Bucket(TESTS_BUCKET)).download_file(
            f'{test_id}.input', path)

    return path


async def add_code(submission_to_storage: SubmissionToStorage):
    """Add submission code to storage.

    Uploads object to S3 bucket.

    Parameters
    ----------
    submission_to_storage: SubmissionToStorage - code and submission_id
    """
    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        obj = await s3.Object(SUBMISSIONS_BUCKET,
                              str(submission_to_storage.submission_id))
        await obj.put(Body=submission_to_storage.code)


async def get_extension_by_lang(lang: str) -> str:
    """Get file extension by language."""
    ext = None

    if lang in ('python3', 'python2'):
        ext = 'py'
    elif lang == 'c':
        ext = 'c'
    elif lang == 'c++':
        ext = 'cpp'
    elif lang == 'pascal':
        ext = 'pas'

    assert ext is not None

    return ext


async def download_submission_code(submission_id: int, lang: str) -> str:
    """Download submission code and return path to local file."""
    ext = await get_extension_by_lang(lang)

    path = f'{LOCAL_STORAGE_ROOT}/submissions/{submission_id}.{ext}'

    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        await (await s3.Bucket(SUBMISSIONS_BUCKET)).download_file(str(
            submission_id), path)

    return path


async def get_code(submission_id: int) -> str:
    """Get file from storage and returns its content."""
    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        obj = await s3.Object(SUBMISSIONS_BUCKET, f'{submission_id}')

        obj_body = (await obj.get())['Body']

        code = await obj_body.read()

        return code.decode()


async def add_task(task_info: dict):
    """Add task."""
    alias = task_info['alias']

    async with aioboto3.resource("s3", endpoint_url=S3_ENDPOINT) as s3:
        obj = await s3.Object(TASKS_BUCKET, '/pending/' + alias + '.json')
        await obj.put(Body=json.dumps(task_info))
