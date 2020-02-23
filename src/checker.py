import asyncio

from src.dataclass import ResultToDB

from src.storage import get_correct_results
from src.database import get_points_for_tests, add_results_to_db, change_submission_status


async def get_result(result_to_checker):
    submission_id = result_to_checker.submission_id
    test_ids = [x.test_id for x in result_to_checker.test_results]
    correct_results = get_correct_results(test_ids)
    points = await get_points_for_tests(test_ids)
    result_to_db = check_result(result_to_checker.test_results, correct_results, submission_id, points)

    await add_results_to_db(result_to_db)
    await change_submission_status(submission_id, 'Completed')


def check_result(test_results, correct_results, submission_id, points):
    def check_one(output, right):
        output = output.strip()
        right = right.strip()

        if output == right:
            return 'OK'
        return 'WA'

    result_to_db = []

    for test_result, correct, point in zip(test_results, correct_results, points):
        test_id = test_result.test_id
        status = test_result.status
        result = test_result.result
        wall_time = test_result.wall_time
        cpu_time = test_result.cpu_time
        points = point

        if status == 'C':
            status = check_one(result, correct)
            points = 10

        prepare_result = ResultToDB(
            submission_id, test_id, status, points, wall_time, cpu_time)
        result_to_db.append(prepare_result)

    return result_to_db
