import unittest
from pyfakefs.fake_filesystem_unittest import TestCase

from ..storage import get_correct_results

from os import getenv

STORAGE_ROOT = getenv('STORAGE_ROOT')


class TestCase(TestCase):
    def setUp(self):
        self.setUpPyfakefs()

    def test_one(self):
        data = ['1', '23', '123', '123\n45\n1 0 1 0 2']

        for test_id, test_output in enumerate(data):
            self.fs.create_file(f'{STORAGE_ROOT}/test/{test_id}/output.txt',
                                contents=test_output)

        self.assertListEqual(get_correct_results(list(range(len(data)))), data)


if __name__ == "__main__":
    unittest.main()
