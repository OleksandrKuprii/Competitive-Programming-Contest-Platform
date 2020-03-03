import asyncio
from os import environ, getenv

from dotenv import load_dotenv

from .api import run
from .database import establish_connection

# Load development environment
if 'PROD' not in environ.keys():
    load_dotenv('dev.env')


async def main():
    await establish_connection(getenv('PG_CONN'))
    await run()


if __name__ == '__main__':
    asyncio.run(main())
