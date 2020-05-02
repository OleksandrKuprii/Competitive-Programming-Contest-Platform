"""Configs for runner."""
from dataclass import CompilerConfig, RunnerConfig

compiler_configs = {
    'python3': CompilerConfig(is_compilable=False),
    'python2': CompilerConfig(is_compilable=False),
    'c': CompilerConfig(is_compilable=True, image='gcc:9.3.0', command='gcc',
                        args='-o compiled/compiled.out'),
    'c++': CompilerConfig(is_compilable=True, image='gcc:9.3.0', command='g++',
                          args='-o compiled/compiled.out'),
    'pascal': CompilerConfig(is_compilable=True, image='fpc',
                             command='fpc', args="-o'compiled/compiled.out'")
}

runner_configs = {
    'python3': RunnerConfig(image='python:3.8-slim', command='python',
                            is_compilable=False),
    'python2': RunnerConfig(image='python:2.7-slim', command='python',
                            is_compilable=False),
    'c': RunnerConfig(image='gcc:9.3.0', command='', is_compilable=True,
                      file_path='compiled/compiled.out'),
    'c++': RunnerConfig(image='gcc:9.3.0', command='', is_compilable=True,
                        file_path='compiled/compiled.out'),
    'pascal': RunnerConfig(image='fpc', command='',
                           is_compilable=True,
                           file_path='compiled/compiled.out')
}
