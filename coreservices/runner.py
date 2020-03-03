import asyncio
import json
from typing import List

from .checker import get_result
from .dataclass import ResultToChecker, SubmissionToRunner, TestResult

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


def generate_test_result(test_id, script_test_result) -> TestResult:
    if script_test_result['status'] == 'OK':
        return TestResult(test_id=test_id,
                          status='OK',
                          result=script_test_result['output'],
                          wall_time=script_test_result['real_time'],
                          cpu_time=script_test_result['user_time'])

    return TestResult(test_id=test_id,
                      status=script_test_result['status'],
                      result=None,
                      wall_time=None,
                      cpu_time=None)


def generate_result_to_checker(submission_id: int, test_ids: List[int],
                               script_test_results: list) -> ResultToChecker:
    test_results = [
        generate_test_result(test_id, script_test_result)
        for (test_id, script_test_result) in zip(test_ids, script_test_results)
    ]

    return ResultToChecker(submission_id=submission_id,
                           test_results=test_results)


async def process_submission(submission_to_runner: SubmissionToRunner):
    proc = await asyncio.create_subprocess_shell(
        "src/scripts/run_submission.sh "
        f"{serialize_submission_to_runner(submission_to_runner)}",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate()

    if str(stderr, 'ascii') != '':
        assert False
    else:
        generate_result_to_checker(submission_to_runner.submission_id,
                                   submission_to_runner.test_ids,
                                   json.loads(str(stdout, 'ascii')))


async def pipe_to_checker(result_to_checker):
    get_result(result_to_checker)


async def loop():
    while True:
        submission_to_runner = await queue.get()

        await process_submission(submission_to_runner)
