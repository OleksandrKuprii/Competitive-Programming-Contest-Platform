from os import getenv


STORAGE_ROOT = getenv('STORAGE_ROOT')


def get_correct_results(test_ids_iterable):
    def get_correct_result(_id):
        path = f'{STORAGE_ROOT}/test/{_id}/output.txt'

        with open(path, 'r') as f:
            return f.read()

    return [get_correct_result(test_id) for test_id in test_ids_iterable]
