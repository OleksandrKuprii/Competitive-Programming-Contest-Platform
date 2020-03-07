"""Module for sharing common dataclasses between other microlibs."""
from dataclasses import dataclass
from typing import List


@dataclass
class ResultToDB:
    """Result that can be placed in database."""

    submission_id: int
    test_id: int
    status: str
    points: int
    wall_time: float
    cpu_time: float


@dataclass
class SubmissionToDB:
    """Submission that can be placed in database."""

    user_id: int
    task_id: int
    timestamp: int
    lang: str
    status: str


@dataclass
class SubmissionToRunner:
    """Submission that runner can accept."""

    submission_id: int
    test_ids: List[int]
    lang: str
    code: str
    wall_time_limit: float
    cpu_time_limit: float
    memory_limit: float


@dataclass
class SubmissionToStorage:
    """Submission that storage can accept."""

    submission_id: int
    lang: str
    code: str


@dataclass
class TestResult:
    """Result of user's submission program for test."""

    test_id: int
    status: str
    result: str
    wall_time: float
    cpu_time: float


@dataclass
class ResultToChecker:
    """Result of user's submission program that checker accepts."""

    submission_id: int
    test_results: List[TestResult]


@dataclass
class UserSubmission:
    """User submission representation."""

    user_id: int
    task_id: int
    timestamp: int
    lang: str
    code: str
