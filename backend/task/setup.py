"""setup.py for task."""
from setuptools import setup

microlib_name = 'toucan.task'

setup(name=microlib_name,
      py_modules=['toucan.task'],
      namespace_packages=['toucan'],
      install_requires=['toucan.dataclass', 'toucan.database', 'markdown2'])
