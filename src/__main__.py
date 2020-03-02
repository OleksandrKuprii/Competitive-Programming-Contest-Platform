import asyncio
from os import getenv

from src.api import run
from src.database import establish_connection


async def main():
    await establish_connection(getenv('PG_CONN'))
    await run()


if __name__ == '__main__':
    asyncio.run(main())
