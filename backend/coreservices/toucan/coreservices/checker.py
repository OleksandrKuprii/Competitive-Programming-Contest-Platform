from typing import List

from toucan.database import (add_results_to_db, change_submission_status,
                       get_points_for_tests)
from toucan.dataclass import ResultToChecker, ResultToDB, TestResult
from toucan.storage import get_correct_results


async def get_result(result_to_checker: ResultToChecker) -> None:
    """Is called from runner and checks results, that user's program
    returned - compares with correct results for task in storage,
    updates status in table 'submissions' in database and
    inserts results to table 'results' in database

    Parameters
    ----------
    result_to_checker : ResultToChecker
        ResultToChecker object, that runner returned
    """

    # Defining variables that get values from ResultToChecker object
    submission_id = result_to_checker.submission_id
    test_ids = [x.test_id for x in result_to_checker.test_results]

    # Getting correct results from storage module
    correct_results = get_correct_results(test_ids)

    # Getting points for tests from database module
    points = await get_points_for_tests(test_ids)

    # Checking result by calling local function
    result_to_db = check_result(result_to_checker.test_results,
                                correct_results, submission_id, points)

    # Adding results to database by database module
    await add_results_to_db(result_to_db)

    # Changing submission status by database module
    await change_submission_status(submission_id, 'Completed')


def check_result(test_results: List[TestResult], correct_results: List[str],
                 submission_id: int,
                 points_list: List[int]) -> List[ResultToDB]:
    """Checks results for all tests and forms ResultToDB dataclass

    Parameters
    ----------
    test_results : List[TestResult]
        The list of TestResult objects
    correct_results : List[str]
        Correct results for all tests
    submission_id : int
        The id of this submission
    points_list : List[int]
        The value of correct answer for each test

    Returns
    -------
    result_to_db : List[ResultToDB]
        The list of ResultToDB objects
    """
    def check_one(output: str, right: str) -> str:
        """Checks equality of too strings

       Parameters
       ----------
       output : str
           The output from user's program for this test
       right : str
           The correct output for this test

       Returns
       -------
       _ : str
           The status for this checking
           OK - result is correct
           WA - result is incorrect
       """
        output = output.strip()
        right = right.strip()

        if output == right:
            return 'OK'
        return 'WA'

    results_to_db = list()

    # Zipping all variables into one iterable for each test
    for test_result, correct, point in\
            zip(test_results, correct_results, points_list):

        # Defining variables that get value from TestResult dataclass
        # properties
        test_id = test_result.test_id
        status = test_result.status
        result = test_result.result
        wall_time = test_result.wall_time
        cpu_time = test_result.cpu_time

        # Default points is 0 - for wrong answer, later if answer
        # correct - updating to :point value
        points = 0

        # Checking one test if runner returned 'SS' status
        if status == 'SS':
            status = check_one(result, correct)

        # Updating :points value if result is correct
        if status == 'OK':
            points = point

        # Defining ResultToDB object for one checked result
        result_to_db = ResultToDB(submission_id, test_id, status, points,
                                  wall_time, cpu_time)

        results_to_db.append(result_to_db)

    return results_to_db
