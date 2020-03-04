from coreservices.storage import get_correct_results
from os import getenv

STORAGE_ROOT = getenv('STORAGE_ROOT')


def test_get_correct_results(fs):
    data = ['1', '23', '123', '123\n45\n1 0 1 0 2']

    for test_id, test_output in enumerate(data):
        fs.create_file(f'{STORAGE_ROOT}/test/{test_id}/output.txt',
                       contents=test_output)

    assert get_correct_results(list(range(len(data)))) == data
