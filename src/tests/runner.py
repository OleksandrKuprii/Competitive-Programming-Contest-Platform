from src.runner import generate_result_to_checker
from src.dataclass import ResultToChecker, TestResult as _TestResult


def test_generate_result_to_checker():
    submission_id = 10
    test_ids = [1, 2, 3]

    assert generate_result_to_checker(
        submission_id, test_ids, [{
            'status': 'TL'
        }, {
            'status': 'OK',
            'output': '12',
            'real_time': 0.3,
            'user_time': 0.2
        }, {
            'status': 'TL'
        }]) == ResultToChecker(submission_id, [
            _TestResult(test_ids[0], 'TL', None, None, None),
            _TestResult(test_ids[1], 'OK', '12', 0.3, 0.2),
            _TestResult(test_ids[2], 'TL', None, None, None)
        ])
