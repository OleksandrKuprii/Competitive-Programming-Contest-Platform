from dataclass import ResultToDB


from storage import get_correct_results


def get_result(result_to_checker):
    test_ids = [x.test_id for x in result_to_checker.test_results]
    correct_results = get_correct_results(test_ids)

    result_to_db = check_result(
        result_to_checker.test_results,
        correct_results, result_to_checker.submission_id)

    return result_to_db


def check_result(test_results, correct_results, submission_id):
    def check_one(output, right):
        output = output.strip()
        right = right.strip()

        if output == right:
            return 'OK'
        return 'WA'

    result_to_db = []

    for test_result, correct in zip(test_results, correct_results):
        test_id = test_result.test_id
        status = test_result.status
        result = test_result.result
        wall_time = test_result.wall_time
        cpu_time = test_result.cpu_time
        points = 0

        if status == 'C':
            status = check_one(result, correct)
            points = 10

        prepare_result = ResultToDB(
            submission_id, test_id, status, points, wall_time, cpu_time)
        result_to_db.append(prepare_result)

    return result_to_db


def add_results_to_db():
    pass


def change_submission_status_in_db():
    pass
