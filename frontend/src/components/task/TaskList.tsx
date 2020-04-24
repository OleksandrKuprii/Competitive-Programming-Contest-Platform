import * as React from 'react';
import CustomTable, { CustomTableRow } from '../table/CustomTable';
import TaskDifficulty from './TaskDifficulty';
import TaskLinkByTask from './TaskLinkByTask';
import GreatestResult from '../result/GreatestResult';
import CategoryName from '../category/CategoryName';
import { Task } from '../../models/interfaces';
import TaskRatingHistogram from './rating/TaskRatingHistogram';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const sortOptions = ['name', 'category', 'difficulty', 'result'];

  const rows = tasks.map(
    ({ id, name, difficulty, rating, category }) =>
      ({
        id,
        row: (
          <>
            <td style={{ maxWidth: 200, overflow: 'hidden' }}>
              <TaskLinkByTask taskName={name} id={id} />
            </td>
            <td>
              <CategoryName id={category} />
            </td>
            <td>
              {difficulty === undefined ? (
                ''
              ) : (
                <TaskDifficulty id={id} difficulty={difficulty} />
              )}
            </td>
            <td>
              {rating === undefined ? (
                ''
              ) : (
                <TaskRatingHistogram id={id} rating={rating} />
              )}
            </td>
            <td>
              <GreatestResult taskAlias={id} />
            </td>
          </>
        ),
      } as CustomTableRow),
  );

  return (
    <CustomTable
      tableName="task"
      headers={['name', 'category', 'difficulty', 'rating', 'result']}
      enableSortOptionIn={sortOptions}
      rows={rows}
    />
  );
};

export default TaskList;
