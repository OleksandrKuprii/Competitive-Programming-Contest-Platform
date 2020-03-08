"""Tests for storage."""

import os

import toucan.storage
from toucan.dataclass import SubmissionToStorage


def test_add_download_code(fs):
    """Tests adding and downloading code."""
    fs.makedirs(f'{toucan.storage.LOCAL_STORAGE_ROOT}/submissions/')

    toucan.storage.add_code(
        SubmissionToStorage(submission_id=1234, code='print(1)'))

    expected_path = f'{toucan.storage.LOCAL_STORAGE_ROOT}/submissions/1234.py'

    actual_path = toucan.storage.download_submission_code(1234, 'python3')

    assert expected_path == actual_path

    assert os.path.exists(expected_path)

    with open(expected_path) as f:
        assert f.read() == 'print(1)'
