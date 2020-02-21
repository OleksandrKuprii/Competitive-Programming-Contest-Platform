from dataclasses import dataclass


@dataclass
class SubmissionToQueue:
    submission_id: int
    lang: str
    code: str
