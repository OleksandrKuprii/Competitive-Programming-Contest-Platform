import asyncio
from os import environ, getenv

from .api import run
from toucan.database import establish_connection


async def main():
    await establish_connection(getenv('PG_CONN'))
    await run()


asyncio.run(main())
