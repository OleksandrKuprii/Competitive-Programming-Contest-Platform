"""Setup.py for checker."""
from setuptools import setup

microlib_name = 'toucan.checker'

setup(name=microlib_name,
      py_modules=['toucan.checker'],
      namespace_packages=['toucan'],
      install_requires=['toucan.database', 'toucan.storage', 'aiohttp', 'aiohttp_cors'])
