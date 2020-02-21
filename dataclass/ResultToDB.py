from dataclasses import dataclass


@dataclass
class ResultToDB:
    submission_id: int
    test_id: int
    status: str
    points: int
    wall_time: float
    cpu_time: float
