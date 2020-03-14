"""setup.py for coreservices."""

from setuptools import setup

microlib_name = 'toucan.coreservices'

setup(name=microlib_name,
      py_modules=[
          'toucan.coreservices.api', 'toucan.coreservices.runner',
          'toucan.coreservices.submission'
      ],
      namespace_packages=['toucan'],
      install_requires=[
          'aiohttp[speedups]', 'toucan.database', 'toucan.dataclass',
          'toucan.storage'
      ])
