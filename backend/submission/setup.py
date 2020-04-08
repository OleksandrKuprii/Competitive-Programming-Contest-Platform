"""setup.py for coreservices."""

from setuptools import setup

microlib_name = 'toucan.submission'

setup(name=microlib_name,
      py_modules=[
          'toucan.submission'
      ],
      namespace_packages=['toucan'],
      install_requires=[
          'toucan.database', 'toucan.dataclass',
          'toucan.storage', 'toucan.task'
      ])
