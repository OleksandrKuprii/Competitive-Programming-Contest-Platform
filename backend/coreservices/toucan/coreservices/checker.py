"""Checks user submission program output."""
import asyncio
import typing

import toucan.database
import toucan.storage
from toucan.dataclass import ResultToChecker, ResultToDB, TestResult


async def process_result_to_checker(result_to_checker: ResultToChecker):
    """Check result_to_checker and update corresponding rows in database."""
    test_ids = [x.test_id for x in result_to_checker.test_results]

    correct_results = toucan.storage.get_correct_results(test_ids)

    points = await toucan.database.get_points_for_tests(test_ids)

    results_to_db = (
        result_to_db_without_submission_id(result_to_checker.submission_id)
        for result_to_db_without_submission_id in check_test_results(
            result_to_checker.test_results, correct_results,
            result_to_checker.submission_id, points))

    # Updates data in db
    await asyncio.gather(
        toucan.database.add_results_to_db(results_to_db),
        toucan.database.change_submission_status(
            result_to_checker.submission_id, 'Completed'))


def check_test_results(
    test_results: typing.List[TestResult], correct_results: typing.List[str],
    points_list: typing.List[int]
) -> typing.Generator[typing.Callable[int, ResultToDB], None, None]:
    """Compare correct results with given, calculate points.

    Returns anonymous ResultToDB instances -
    submission_id should be given as an argument.
    """
    for test_result, correct, points in zip(test_results, correct_results,
                                            points_list):
        status = test_result.status  # Inherit status from runner

        test_points = 0  # points for current test

        # Checks only successfully executed tests
        if status == 'Success':
            if test_result.result.strip() == correct.strip():
                status = 'Correct'
                test_points = points  # gives points for correct output
            else:
                status = 'WrongAnswer'

        yield lambda submission_id: ResultToDB(
            submission_id, test_result.test_id, status, test_points,
            test_result.wall_time, test_result.cpu_time)
