"""User module."""
from asyncpg.connection import Connection
from typing import Optional

from user import database


async def get_user_info(nickname: str, conn: Connection) -> Optional[dict]:
    """Get user info by nickname.

    Parameters
    ----------
    nickname: str
        The nickname of the user
    conn: Connection
        A connection to the database

    Returns
    -------
    user_info: Optional[dict]
        Information about user if exists, else - None
    """
    # Get user info from database
    user_info = await database.get_user_info(nickname, conn)

    if user_info is None:
        return None

    # Convert datetime and date objects to ISO format
    columns_with_date = ('birthday', 'registered')
    for col in columns_with_date:
        try:
            user_info[col] = user_info[col].isoformat()
        except AttributeError:
            pass

    return user_info


async def get_my_info(user_id: str, conn: Connection) -> dict:
    """Get user info by user id.

    Parameters
    ----------
    user_id: int
        The id of the user
    conn: Connection
        A connection to the database

    Returns
    -------
    user_info: dict
        Information about user if exists, else - empty dictionary
    """
    # Get nickname by user id from database
    nickname = await database.get_nickname_by_id(user_id, conn)

    # If nickname does not exist, return empty dictionary
    if not nickname:
        return {}

    # Get user info by nickname
    user_info = await get_user_info(nickname, conn)

    return user_info


async def register_user(user_id: str, user_info: dict, conn: Connection) -> None:
    """Register new user and insert user info to the database.

    Parameters
    ----------
    user_id:
        The id of the user
    user_info: dict
        Information about new user to be inserted in the database
    conn: Connection
        A connection to the database
    """
    # Call database to register user
    await database.register_user(user_id, user_info['email'], conn)
    await update_profile(user_id, user_info, conn)


async def update_profile(user_id: str, info: dict, conn: Connection) -> None:
    """Update user info for <user_id> with <info>.

    Parameters
    ----------
    user_id: str
        The id of the user
    info: dict
        The information about the user to be updated
    conn: Connection
        A connection to the database
    """
    # A variable to store sql, that will be added to the query to update
    # profile
    sql = ''

    # Columns that can be modified, another ones in <info> will be ignored
    columns = ('nickname', 'name', 'birthday', 'country', 'bio', 'city',
               'school', 'email', 'picture')

    for k, v in info.items():

        # Ignore columns that are not in allowed ones
        if k not in columns:
            continue

        # Updating date without quotes
        if k == 'birthday':
            sql += f"{k} = {v}, "
        else:
            sql += f"{k} = '{v}', "

    # Trim two chars in the end of string, they are ", "
    sql = sql[:-2]

    # Call database to update profile
    await database.update_profile(user_id, sql, conn)


async def check_registration(user_id: str, conn: Connection) -> bool:
    """Check if user was registered and he exists in the database.

    Parameters
    ----------
    user_id: str
        The id of the user
    conn: Connection
        A connection to the database
    """
    return await database.check_registration(user_id, conn)


async def check_nickname_existence(nickname: str, conn: Connection) -> bool:
    """Check if nickname exists in the database.

    Parameters
    ----------
    nickname: str
        The nickname that has to be checked
    conn: Connection
        A connection to the database
    """
    return await database.check_nickname_existence(nickname, conn)


async def get_registered_users(conn: Connection) -> set:
    """Get registered users."""
    return await database.get_registered_users(conn)
