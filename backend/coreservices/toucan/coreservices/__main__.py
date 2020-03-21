import asyncio
import toucan.coreservices.api
import toucan.database

import os


async def main():
    if 'PG_CONN' in os.environ:
        await toucan.database.establish_connection(
            os.getenv('POSTGRES_CONNECTION_STRING'))
    else:
        await toucan.database.establish_connection_params(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            database=os.getenv('POSTGRES_DB')
            )

    await toucan.coreservices.api.run()


asyncio.run(main())
