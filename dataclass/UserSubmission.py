from dataclasses import dataclass


@dataclass
class UserSubmission:
    user_id: int
    task_id: int
    timestamp: int
    lang: str
    code: str
