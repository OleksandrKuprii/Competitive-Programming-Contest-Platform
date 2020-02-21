from dataclasses import dataclass


@dataclass
class ResultToChecker:
    submission_id: int
    test_results: list  # TestResults[]


@dataclass
class ResultToDB:
    submission_id: int
    test_id: int
    status: str
    points: int
    wall_time: float
    cpu_time: float


@dataclass
class SubmissionToDB:
    user_id: int
    task_id: int
    timestamp: int
    lang: str
    code: str


@dataclass
class SubmissionToQueue:
    submission_id: int
    test_ids: list  # int[]
    lang: str
    code: str


@dataclass
class SubmissionToStorage:
    submission_id: int
    lang: str
    code: str


@dataclass
class TestResult:
    test_id: int
    status: str
    result: str
    wall_time: float
    cpu_time: float


@dataclass
class UserSubmission:
    user_id: int
    task_id: int
    timestamp: int
    lang: str
    code: str
