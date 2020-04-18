"""Statistics entry point."""
import asyncio

from backend.toucan.gather_statistics import task_statistic
from backend.toucan.database import establish_connection_from_env


async def main():
    """Start all processes to gather statistic."""
    # Creating pool to the database
    pool = await establish_connection_from_env()

    async with pool.acquire() as conn:

        # Gather task statistic
        await task_statistic.main(conn)


if __name__ == '__main__':
    asyncio.run(main())
