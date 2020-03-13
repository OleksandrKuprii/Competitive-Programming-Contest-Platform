"""Module for parsing output of bash time builth-in."""
import re
import typing


def check(string: str) -> bool:
    """Check if string matches bash time format."""
    return bool(re.match(r'^(\n[a-zA-Z]+\t\d+m\d+\.\d+s)+$', string))


def parse(string) -> typing.Generator[int, None, None]:
    """Parse bash time.

    Output is in milliseconds.
    """
    for match in re.findall(r'\d+m\d+\.\d+', string):
        parts = match.split('m')

        minutes = int(parts[0])
        seconds = float(parts[1])

        yield int((seconds + minutes * 60) * 1000)
