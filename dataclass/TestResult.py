from dataclasses import dataclass


@dataclass
class TestResult:
    test_id: int
    status: str
    result: str
    wall_time: float
    cpu_time: float
