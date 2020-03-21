"""Coreservices entrypoint."""
import asyncio

import toucan.coreservices.api
import toucan.database


async def main():
    """Run coreservices."""
    await toucan.database.establish_connection_from_env()

    await toucan.coreservices.api.run()


if __name__ == '__main__':
    asyncio.run(main())
