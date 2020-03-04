from os import getenv, makedirs
from os.path import exists
from typing import List

from dataclass import SubmissionToStorage

STORAGE_ROOT = getenv('STORAGE_ROOT')


def get_correct_results(test_ids: List[int]) -> List[str]:
    """Gets correct results for tests from storage by test ids from
    function parameters

    Parameters
    ----------
    test_ids : List[int]
        The list of test ids

    Returns
    -------
    _ : List[str]
        The list of correct results for each test
    """

    def get_correct_result(_id: int) -> str:
        """Open file from storage by _id and reads its content

        Parameters
        ----------
        _id : int
            The id of the test

        Returns
        -------
        correct_result : str
            Content of the file
        """
        path = f'{STORAGE_ROOT}/test/{_id}/output.txt'

        with open(path, 'r') as f:
            return f.read()

    # Returning List[str] of correct results by each task id in task_ids
    return [get_correct_result(test_id) for test_id in test_ids]


def add_code(submission_to_storage: SubmissionToStorage) -> None:
    """Adds code to storage

    Parameters
    ----------
    submission_to_storage : SubmissionToStorage
        SubmissionToStorage object, which contains details of saving
        file with program
    """

    # Defining variable, which means extension of the file to save and
    # default is equal to None
    ext = None

    # Updating :ext in case of different languages
    if submission_to_storage.lang in ('python3', 'python2'):
        ext = 'py'

    # If language was unrecognised before asserts an exception
    assert ext is not None

    # Defining variable, which means details of the place where to save
    path = f'{STORAGE_ROOT}/submission/' \
           f'{submission_to_storage.submission_id}/'
    filename = f'main.{ext}'

    # Checking if this path does not exist and if true - creating
    # missing directories
    if not exists(path):
        makedirs(path)

    # Writing user's code with before defined details
    with open(path + filename, 'w') as submission_file:
        submission_file.write(submission_to_storage.code)
