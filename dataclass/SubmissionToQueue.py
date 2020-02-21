from dataclasses import dataclass


@dataclass
class SubmissionToQueue:
    submission_id: int
    test_ids: list # int[]
    lang: str
    code: str
