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
    wall_time: int
    cpu_time: int


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
    wall_time_limit: int
    cpu_time_limit: int
    memory_limit: int


@dataclass
class SubmissionToStorage:
    """Submission that storage can accept."""

    submission_id: int
    code: str


@dataclass
class TestResult:
    """Result of user's submission program for test."""

    test_id: int
    status: str
    result: str
    wall_time: int
    cpu_time: int


@dataclass
class ResultToChecker:
    """Result of user's submission program that checker accepts."""

    submission_id: int
    test_results: List[TestResult]


@dataclass
class UserSubmission:
    """User submission representation."""

    user_id: int
    alias: str
    timestamp: int
    lang: str
    code: str
