"""The task statisctic module."""
from asyncpg.connection import Connection
from typing import List

from gather_statistics import database


async def process_data(task_data: List[dict]) -> dict:
    """Process data from the database to more suitable format.

    Count number of full, partial, zero answers for each task and programming
    language and represent it in hierarchy of dictionaries.

    Parameters
    ----------
    task_data: List[dict]
        The information about tasks returned by database module

    Returns
    -------
    data: dict
        The same data in more suitable format
    """
    data = dict()

    # For each record in task_data
    for record in task_data:

        # Saving values to the variables of the same name
        task_id = record['task_id']
        lang = record['lang']
        points = record['points']

        # Finding put the answer type by the amount of the points
        answer_type = 'partial'
        if points == 100:
            answer_type = 'full'
        elif points == 0:
            answer_type = 'zero'

        # If this task id is not in <data>, add an empty dictionary for this
        # key in <data>
        if task_id not in data.keys():
            data[task_id] = dict()

        # If this lang is not in <data>[<task_id>], add an empty dictionary for
        # this key in <data>
        if lang not in data[task_id].keys():
            # Store zero values for each type of answers. By default they are
            # 0, but later they might be changed
            data[task_id][lang] = {'full': 0, 'partial': 0, 'zero': 0}

        data[task_id][lang][answer_type] += 1

    return data


async def prepare_data(input_data: dict) -> List[tuple]:
    """Prepare data to be inserted in the database.

    Parameters
    ----------
    input_data: dict
        The data returned by process_data function

    Returns
    -------
    data: List[tuple]
        The data to be inserted in the database
    """
    data = list()

    # For task id and information about languages in items of the <input_data>
    for task_id, task_info in input_data.items():

        # For lang and the answers made with it in items of the <task_info>
        for lang, lang_info in task_info.items():

            # Append <data> with new tuple which contains <task_id>, <lang>,
            # and 3 numbers for amount of submissions of each answer type(
            # full, partial, zero)
            data.append((task_id, lang, *lang_info.values()))

    return data


async def main(conn: Connection) -> None:
    """Start gathering statistic for task.

    Parameters
    ----------
    conn: Connection
        The connection to the database
    """
    # Get task data from database
    task_data = await database.collect_task_data(conn)

    # Process this data
    data = await process_data(task_data)

    # Prepare data to an insertion to the database
    data = await prepare_data(data)

    # Insert data to the database
    await database.insert_task_statistic(data, conn)
