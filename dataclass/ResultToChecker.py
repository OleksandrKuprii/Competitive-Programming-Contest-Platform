from dataclasses import dataclass


@dataclass
class ResultToChecker:
    submission_id: int
    test_results: list # TestResults[]
