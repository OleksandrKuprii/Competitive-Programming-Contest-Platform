"""setup.py for storage."""
from setuptools import setup

microlib_name = 'toucan.storage'

setup(name=microlib_name,
      py_modules=['toucan.storage'],
      namespace_packages=['toucan'],
      install_requires=['boto3', 'toucan.dataclass'])