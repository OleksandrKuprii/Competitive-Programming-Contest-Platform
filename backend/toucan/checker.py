"""Checks user submission program output."""
import logging
from typing import Iterable, List

import database
import storage
from dataclass import ResultToChecker, ResultToDB, TestResult


logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


async def process_result_to_checker(result_to_checker: ResultToChecker, conn
                                    ) -> None:
    """Check result_to_checker and update corresponding rows in database.

    Parameters
    ----------
    result_to_checker: ResultToChecker
        The ResultToChecker dataclass
    """
    submission_id = result_to_checker.submission_id

    # Getting test_results from result_to_checker and writing to list
    test_ids = [x.test_id for x in result_to_checker.test_results]

    # Getting correct results from storage
    correct_results = await storage.get_correct_results(test_ids)

    logging.info(f'#{submission_id} Checker got correct results')

    # Getting points for each test from database
    points = await database.get_points_for_tests(test_ids, conn)

    # Checking results
    results_to_db = await check_test_results(result_to_checker.test_results,
                                             correct_results, points,
                                             submission_id)

    logging.info(f'#{submission_id} Checked results')

    # Adding results to database
    await database.add_results_to_db(results_to_db, conn)

    # Calling database to update task bests
    await database.update_task_bests(submission_id, conn)

    # Changing submission status in database to 'Completed'
    await database.change_submission_status(submission_id, 'Completed', conn)

    logging.info(f'#{submission_id} Finished everything')


async def check_test_results(
        test_results: List[TestResult],
        correct_results: Iterable[str],
        points_list: List[int],
        submission_id: int
) -> List[ResultToDB]:
    """Compare correct results with given, calculate points.

    Returns anonymous ResultToDB instances -
    submission_id should be given as an argument.
    """
    results = list()
    for test_result, correct, points in zip(test_results, correct_results,
                                            points_list):
        status = test_result.status  # Inherit status from runner

        test_points = 0  # points for current test

        try:
            test_string = test_result.result.strip().replace('\r\n', '\n')
            correct_string = correct.decode().strip().replace('\r\n', '\n')

            # Checks only successfully executed tests
            if status == 'Success':
                if test_string == correct_string:
                    status = 'Correct'
                    test_points = points  # gives points for correct output
                else:
                    status = 'WrongAnswer'
        except AttributeError:
            status = 'WrongAnswer'

        results.append(ResultToDB(
            submission_id, test_result.test_id, status, test_points,
            test_result.wall_time, test_result.cpu_time))

    return results
