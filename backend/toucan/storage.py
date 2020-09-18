"""Handles storage logic."""
import json

from dataclass import SubmissionToStorage
from env import tasks_bucket, tests_bucket, submissions_bucket, resource, storage_root


async def get_correct_result(test_id: int) -> str:
    """Return correct results for given test ids.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    test_id: int - test id
    """
    async with resource("s3") as s3:
        obj = await s3.Object(tests_bucket, f'{test_id}.output')

        obj_body = (await obj.get())['Body']

        return await obj_body.read()


async def download_input(test_id: int) -> str:
    """Download inputs for given test ids and return their paths.

    Generator function, reads objects from S3 bucket.

    Parameters
    ----------
    test_id: int - test id
    """
    async with resource("s3") as s3:
        path = f'{storage_root}/tests/{test_id}.input'

        await(await s3.Bucket(tests_bucket)).download_file(
            f'{test_id}.input', path)

    return path


async def add_code(submission_to_storage: SubmissionToStorage):
    """Add submission code to storage.

    Uploads object to S3 bucket.

    Parameters
    ----------
    submission_to_storage: SubmissionToStorage - code and submission_id
    """
    async with resource("s3") as s3:
        obj = await s3.Object(submissions_bucket,
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

    async with resource("s3") as s3:
        await (await s3.Bucket(submissions_bucket)).download_file(str(
            submission_id), path)

    return path


async def get_code(submission_id: int) -> str:
    """Get file from storage and returns its content."""
    async with resource("s3") as s3:
        obj = await s3.Object(submissions_bucket, f'{submission_id}')

        obj_body = (await obj.get())['Body']

        code = await obj_body.read()

        return code.decode()


async def add_task(task_info: dict):
    """Add task."""
    alias = task_info['alias']

    async with resource("s3") as s3:
        obj = await s3.Object(tasks_bucket, '/pending/' + alias + '.json')
        await obj.put(Body=json.dumps(task_info))
