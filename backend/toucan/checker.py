"""Checks user submission program output."""
import logging

import database
import storage
from dataclass import ResultToDB, TestResult

from asyncpg.connection import Connection

logging.basicConfig(filename='runner.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')


async def update_task_bests(submission_id: int, conn: Connection):
    """Update task bests for submission.

    Parameters
    ----------
    submission_id: int
    conn: Connection
        Database connection
    """
    # Calling database to update task bests
    await database.update_task_bests(submission_id, conn)

    # Changing submission status in database to 'Completed'
    await database.change_submission_status(submission_id, 'Completed', conn)

    logging.info(f'#{submission_id} Finished everything')


async def process_test_result(test_result: TestResult, submission_id: int, conn) -> None:
    """Check result_to_checker and update corresponding rows in database.

    Parameters
    ----------
    result_to_checker: ResultToChecker
        The ResultToChecker dataclass
    """
    test_id = test_result.test_id

    # Getting correct result from storage
    correct_result = await storage.get_correct_result(test_id)

    logging.info(f'#{submission_id} Checker got correct results')

    # Getting points for each test from database
    points = await database.get_points_for_test(test_id, conn)

    # Checking results
    result_to_db = await check_test_result(test_result, correct_result, points, submission_id)

    logging.info(f'#{submission_id} Checked results')

    # Adding results to database
    await database.add_result_to_db(result_to_db, conn)


async def check_test_result(
        test_result: TestResult,
        correct_result: str,
        points: int,
        submission_id: int
) -> ResultToDB:
    """Compare correct results with given, calculate points.

    Returns anonymous ResultToDB instances -
    submission_id should be given as an argument.
    """
    status = test_result.status  # Inherit status from runner

    test_points = 0  # points for current test

    try:
        test_string = test_result.result.strip().replace('\r\n', '\n')
        correct_string = correct_result.decode().strip().replace('\r\n', '\n')

        # Checks only successfully executed tests
        if status == 'Success':
            if test_string == correct_string:
                status = 'Correct'
                test_points = points  # gives points for correct output
            else:
                status = 'WrongAnswer'
    except AttributeError:
        status = 'WrongAnswer'

    return ResultToDB(submission_id, test_result.test_id, status, test_points,
                      test_result.wall_time,
                      test_result.cpu_time)
