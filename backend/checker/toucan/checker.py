"""Checks user submission program output."""
import os
import asyncio
import typing
import json
from pprint import pprint

import boto3

import toucan.database
import toucan.storage
from toucan.dataclass import ResultToChecker, ResultToDB, TestResult

RESULTS_QUEUE_URL = os.getenv('RESULTS_QUEUE_URL')

assert RESULTS_QUEUE_URL is not None


async def process_result_to_checker(result_to_checker: ResultToChecker):
    """Check result_to_checker and update corresponding rows in database."""
    test_ids = [x.test_id for x in result_to_checker.test_results]

    correct_results = toucan.storage.get_correct_results(test_ids)

    points = await toucan.database.get_points_for_tests(test_ids)

    results_to_db = (
        result_to_db_without_submission_id(result_to_checker.submission_id)
        for result_to_db_without_submission_id in check_test_results(
            result_to_checker.test_results, correct_results, points))

    await toucan.database.add_results_to_db(results_to_db)

    await toucan.database.change_submission_status(
        result_to_checker.submission_id, 'Completed')

    print('I AM READY. I FINISHED :)')


def check_test_results(
    test_results: typing.List[TestResult], correct_results: typing.List[str],
    points_list: typing.List[int]
) -> typing.Generator[typing.Callable[[int], ResultToDB], None, None]:
    """Compare correct results with given, calculate points.

    Returns anonymous ResultToDB instances -
    submission_id should be given as an argument.
    """
    for test_result, correct, points in zip(test_results, correct_results,
                                            points_list):
        print(test_result.result, correct)
        status = test_result.status  # Inherit status from runner

        test_points = 0  # points for current test

        # Checks only successfully executed tests
        if status == 'Success':
            if test_result.result.strip() == correct.decode().strip():
                status = 'Correct'
                test_points = points  # gives points for correct output
            else:
                status = 'WrongAnswer'

        yield lambda submission_id: ResultToDB(
            submission_id, test_result.test_id, status, test_points,
            test_result.wall_time, test_result.cpu_time)


async def main():
    if 'PG_CONN' in os.environ:
        await toucan.database.establish_connection(
            os.getenv('POSTGRES_CONNECTION_STRING'))
    else:
        await toucan.database.establish_connection_params(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            database=os.getenv('POSTGRES_DB'))

    sqs = boto3.resource('sqs', endpoint_url=os.getenv('SQS_ENDPOINT'))

    queue = sqs.Queue(url=RESULTS_QUEUE_URL)

    while True:
        messages = queue.receive_messages(MaxNumberOfMessages=10,
                                          WaitTimeSeconds=20)

        if not messages:
            continue

        tasks = []

        for message in messages:
            result_to_checker_json = json.loads(message.body)

            pprint(result_to_checker_json)

            result_to_checker = ResultToChecker(
                submission_id=result_to_checker_json['submission_id'],
                test_results=[
                    TestResult(**t)
                    for t in result_to_checker_json['test_results']
                ])

            tasks.append(process_result_to_checker(result_to_checker))

            message.delete()

        await asyncio.wait(tasks)


if __name__ == '__main__':
    asyncio.run(main())
