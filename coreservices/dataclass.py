from dataclasses import dataclass
from typing import List


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
    status: str


@dataclass
class SubmissionToRunner:
    submission_id: int
    test_ids: List[int]
    lang: str
    code: str
    wall_time_limit: float
    cpu_time_limit: float
    memory_limit: float


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
class ResultToChecker:
    submission_id: int
    test_results: List[TestResult]


@dataclass
class UserSubmission:
    user_id: int
    task_id: int
    timestamp: int
    lang: str
    code: str
