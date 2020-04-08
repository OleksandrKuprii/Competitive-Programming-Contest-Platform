"""setup.py for coreservices."""

from setuptools import setup

microlib_name = 'toucan.api'

setup(name=microlib_name,
      py_modules=[
          'toucan.api'
      ],
      namespace_packages=['toucan'],
      install_requires=[
          'aiohttp[speedups]', 'toucan.database', 'toucan.dataclass',
          'toucan.storage', 'toucan.task', 'aiohttp_cors'
      ])
