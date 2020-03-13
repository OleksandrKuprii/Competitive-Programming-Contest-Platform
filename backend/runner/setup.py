"""setup.py for runner."""
from setuptools import setup

microlib_name = 'toucan.runner'

setup(
    name=microlib_name,
    py_modules=['toucan.runner.worker', 'toucan.runner.main'],
    namespace_packages=['toucan'],
    install_requires=['docker', 'boto3', 'toucan.dataclass', 'toucan.storage'])
