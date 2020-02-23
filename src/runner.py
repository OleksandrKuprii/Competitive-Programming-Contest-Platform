import asyncio
import json

from src.dataclass import SubmissionToRunner


queue = asyncio.Queue()


async def add_submission(submission_to_runner: SubmissionToRunner):
    await queue.put(submission_to_runner)


def serialize_submission_to_runner(submission_to_runner: SubmissionToRunner):
    return json.dumps({
        'submission_id': submission_to_runner.submission_id,
        'language': submission_to_runner.lang,
        'test_ids': submission_to_runner.test_ids,
        'limits': {
            'real_time': submission_to_runner.wall_time_limit,
            'user_time': submission_to_runner.cpu_time_limit,
        }
    })


async def process_submission(submission_to_runner: SubmissionToRunner):
    await asyncio.create_subprocess_exec(
        "src/scripts/run_submission.sh",
        [serialize_submission_to_runner(submission_to_runner)])


async def loop():
    while True:
        submission_to_runner = await queue.get()

        await process_submission(submission_to_runner)
