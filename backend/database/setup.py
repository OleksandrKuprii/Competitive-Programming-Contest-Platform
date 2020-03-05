from setuptools import setup

microlib_name = 'toucan.database'

setup(
    name=microlib_name,
    py_modules=['toucan.database'],
    namespace_packages=['toucan'],
    install_requires=[
        'asyncpg',
        'toucan.dataclass'
    ]
)