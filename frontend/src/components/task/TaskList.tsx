import * as React from 'react';
import CustomTable, { CustomTableRow } from '../CustomTable';
import TaskDifficulty from './TaskDifficulty';
import TaskLinkByTask from './TaskLinkByTask';
import GreatestResult from '../result/GreatestResult';
import CategoryName from '../category/CategoryName';
import { Task } from '../../models/interfaces';
import TaskRatingHistogram from './rating/TaskRatingHistogram';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const rows = tasks.map(
    ({ id, name, difficulty, rating, category }) =>
      ({
        id,
        row: (
          <>
            <td>
              <TaskLinkByTask taskName={name} id={id} />
            </td>
            <td>
              <CategoryName id={category} />
            </td>
            <td>
              {difficulty === undefined ? '' : <TaskDifficulty id={id} difficulty={difficulty} />}
            </td>
            <td>{rating === undefined ? '' : <TaskRatingHistogram id={id} rating={rating} />}</td>
            <td>
              <GreatestResult taskAlias={id} />
            </td>
          </>
        ),
      } as CustomTableRow),
  );

  return (
    <CustomTable
      tableName="taskList"
      headers={['name', 'category', 'difficulty', 'rating', 'result']}
      rows={rows}
    />
  );
};

export default TaskList;
