"""Task module."""
from typing import Iterable, List
from asyncpg.connection import Connection

import database
import submission
from statistic import statistic


async def get_task_info(alias: str, conn: Connection) -> dict:
    """Get task details from database.

    Parameters
    ----------
    alias: str
        The alias of the task

    Returns
    -------
    _: dict
        Dictionary contains all task description, examples and limits
    """
    task_id = await get_task_id_from_alias(alias, conn)

    stat = await statistic.get_data_task_with_lang(task_id, conn)

    task_info = await database.get_task(alias, conn)

    task_info['statistic'] = stat

    return task_info


async def get_tasks(user_id: str, params: dict, conn) -> List[dict]:
    """Get task description.

    Get task description of {number} tasks and add personal result for
    each task for specific user.

    Parameters
    ----------
    user_id: str
        The id of user
    params: dict
        Parameters to sort and filter data

    Returns
    -------
    tasks: List[dict]
        The list contains dictionaries, which represent task
    """
    # Variable to store additional SQL query to give database module
    sql = ''

    if params is not None:

        # A mapping to connect <params> keys with column names in database
        column_map = {
            'name_sort': 'tasks.name',
            'category_sort': 'tasks.category',
            'difficulty_sort': 'tasks.difficulty',
            'date_sort': 'tasks.created'
        }

        def iterable_to_str(iterable: Iterable, quotes=False) -> str:
            """Convert iterable to string separated by comma and space.

            The additional parameter <quotes> with value True puts values in
            iterable to double quotes.

            Returns
            -------
            The final string separated by comma and space
            """
            res = ''
            for x in iterable:
                if quotes:
                    res += "'" + str(x) + "', "
                else:
                    res += str(x) + ', '
            return res[:-2]

        # For each key, value in values of parameters
        for k, v in params.items():

            # If key is 'difficulty'
            if k == 'difficulty':

                # If SQL statement 'WHERE' is present in <sql>
                if 'WHERE' in sql:

                    # Add new filter with logical 'AND'
                    # Converting value to string
                    sql += f'AND {k} IN ({iterable_to_str(v)}) '
                else:

                    # Add new filter starting with SQl statement 'WHERE'
                    # Converting value to string
                    sql += f'WHERE {k} IN ({iterable_to_str(v)}) '

            # If key is 'categories'
            if k == 'categories':

                # If SQL statement 'WHERE' is present in <sql>
                if 'WHERE' in sql:

                    # Add new filter with logical 'AND'
                    # Converting value to string, where each element in quotes,
                    # so SQL get each category as string
                    sql += f'AND category IN ({iterable_to_str(v, True)}) '
                else:

                    # Add new filter starting with SQl statement 'WHERE'
                    # Converting value to string, where each element in quotes,
                    # so SQL get each category as string
                    sql += f'WHERE category IN ({iterable_to_str(v, True)}) '

        # Add new line character to <sql> to divide commands
        sql += '\n'

        # For each key, value in values of parameters
        for k, v in params.items():

            # If key is in <column_map>
            if k in column_map:

                # If SQL statement 'ORDER' is present in <sql>
                if 'ORDER' in sql:

                    # Add new sort to SQL query separated with comma
                    sql += f', {column_map[k]} {v}'
                else:

                    # Add new sort to SQL query with statement 'ORDER BY'
                    sql += f'ORDER BY {column_map[k]} {v}'

        # Add new line character to <sql> to divide commands
        sql += '\n'

        # Add 'LIMIT' and 'OFFSET' statement to query in order to get <number> of
        # tasks and skip <offset> ones
        sql += f'LIMIT {params["number"]} OFFSET {params["offset"]}\n'

    # Get task from database
    tasks = await database.get_tasks(sql, conn)

    # A list to store indexes in <tasks> to be deleted in the end of for loop
    task_index_to_delete = list()

    for i in range(len(tasks)):

        # Pop task_id from <tasks> by <i>(id)
        task_id = tasks[i].pop('id')

        # Getting submission id from database by user and task id
        submission_id = await database.get_submission_id_from_bests(
            user_id, task_id, conn)

        # Set best submission None default. It will be changed if better
        # submission is present in database
        tasks[i]['best_submission'] = {
            'result': None,
            'id': None
        }

        # Try filter by result
        try:
            if submission_id is not None:
                # Getting result for specific task and user if its exists
                result = await submission.get_result(submission_id, user_id,
                                                     conn)

                # If the points number is in values in filter
                if params is not None and result['points'] in params['result']:

                    # Add best submission's information to <tasks>
                    tasks[i]['best_submission'] = {
                        'result': result,
                        'id': submission_id
                    }

                    # And continue to the next iteration of the loop
                    continue

                # In other case add this index to list of ones to be deleted in
                # future
                task_index_to_delete.append(i)

            # Else if None is not present in values to filter
            elif params is not None and None not in params['result']:

                # In other case add this index to list of ones to be deleted in
                # future
                task_index_to_delete.append(i)
        except KeyError:
            # If the KeyError appears means that we function does not have to
            # filter by result and it just appends best submission information
            result = await submission.get_result(submission_id, user_id, conn)
            tasks[i]['best_submission'] = {
                'result': result,
                'id': submission_id
            }

    # A final list to store tasks, that will be pushed with values from
    # previous list but except indexes that must be deleted
    final_tasks = list()

    for i in range(len(tasks)):

        # If index is not in list of indexes, that must be deleted
        if i not in task_index_to_delete:

            # Add task to the <final_tasks>
            final_tasks.append(tasks[i])

            task_alias = tasks[i]['alias']
            task_id = await get_task_id_from_alias(task_alias, conn)

            stat = await statistic.get_data_task(task_id, conn)
            final_tasks[-1]['statistics'] = stat

    try:
        final_tasks.sort(key=lambda x: x['best_submission']['result']['points']
                         )
    except TypeError:
        pass

    return final_tasks


async def get_task_id_from_alias(alias: str, conn) -> int:
    """Get user id from alias.

    Parameters
    ----------
    alias: str
        The alias of the task

    Returns
    -------
    task_id: int
        Task id
    """
    task_id = await database.get_task_id_from_alias(alias, conn)

    return task_id
