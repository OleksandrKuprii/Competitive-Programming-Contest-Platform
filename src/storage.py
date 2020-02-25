from os import getenv, makedirs
from os.path import exists

from src.dataclass import SubmissionToStorage


STORAGE_ROOT = getenv('STORAGE_ROOT')


def get_correct_results(test_ids_iterable):
    def get_correct_result(_id):
        path = f'{STORAGE_ROOT}/test/{_id}/output.txt'

        with open(path, 'r') as f:
            return f.read()

    return [get_correct_result(test_id) for test_id in test_ids_iterable]


def add_code(submission_to_storage: SubmissionToStorage):
    ext = None

    if submission_to_storage.lang in ('python3', 'python2'):
        ext = 'py'

    assert ext is not None

    path = f'{STORAGE_ROOT}/submission/{submission_to_storage.submission_id}/'
    filename = f'main.{ext}'

    if not exists(path):
        makedirs(path)

    with open(path + filename, 'w') as submission_file:
        submission_file.write(submission_to_storage.code)
