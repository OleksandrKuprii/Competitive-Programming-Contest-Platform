"""The database module for user module."""
from asyncpg.connection import Connection
from typing import Optional

from datetime import datetime


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
    async with conn.transaction():
        fetch = await conn.fetchrow("""
            SELECT nickname, name, birthday, country, bio, city, school, email, picture,
                registered, public_task_rating
            FROM coreschema.users
            JOIN coreschema.rating
            ON users.id = rating.user_id
            WHERE nickname = $1
        """, nickname)

    if fetch is None:
        return None

    user_info = dict(fetch)

    return user_info


async def get_nickname_by_id(user_id: str, conn: Connection) -> str:
    """Get nickname by user id.

    Parameters
    ----------
    user_id: str
        The id of the user
    conn: Connection
        A connection to the database

    Returns
    -------
    _: str
        The nickname of the user
    """
    async with conn.transaction():
        fetch = await conn.fetchrow("""
            SELECT nickname
            FROM coreschema.users
            WHERE id = $1
        """, user_id)

    if fetch is None:
        return ''
    return fetch['nickname']


async def register_user(user_info: dict, conn: Connection) -> None:
    """Register new user and insert user info to the database.

    Parameters
    ----------
    user_info: dict
        Information about new user to be inserted in the database
    conn: Connection
        A connection to the database
    """
    # Getting current datetime object to store as date of registration
    timestamp = datetime.now()

    async with conn.transaction():
        await conn.execute("""
            INSERT INTO coreschema.users (id, nickname, name, picture, email,
            registered)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, user_info['sub'], user_info['nickname'], user_info['name'],
            user_info['picture'], user_info['email'], timestamp)

        await conn.execute("""
            INSERT INTO coreschema.rating (user_id, public_task_rating) VALUES ($1, 0)
        """, user_info['sub'])


async def update_profile(user_id: str, sql: str, conn: Connection) -> None:
    """Update user info for <user_id> with <info>.

    Parameters
    ----------
    user_id: str
        The id of the user
    sql: str
        The part of the SQL query to be added to main. It stores parameters
        to set by update
    conn: Connection
        A connection to the database
    """
    async with conn.transaction():
        await conn.execute(f"""
            UPDATE coreschema.users
            SET {sql}
            WHERE id = $1
        """, user_id)
