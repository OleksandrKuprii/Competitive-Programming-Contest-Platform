from setuptools import setup

microlib_name = 'toucan.storage'

setup(
    name=microlib_name,
    packages=[microlib_name],
    namespace_packages=['toucan'],
    install_requires=[
        'toucan.dataclass'
    ]
))