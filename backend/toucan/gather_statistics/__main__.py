"""Statistics entry point."""
import asyncio
from gather_statistics import database
from gather_statistics import task_statistic


async def main():
    """Start all processes to gather statistic."""
    # Creating pool to the database
    pool = await database.establish_connection_from_env()

    async with pool.acquire() as conn:

        # Gather task statistic
        await task_statistic.main(conn)


if __name__ == '__main__':
    asyncio.run(main())
