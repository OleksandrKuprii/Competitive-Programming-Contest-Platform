import * as React from 'react';
import CustomTable, { CustomTableRow } from '../CustomTable';
import TaskDifficulty from './TaskDifficulty';
import TaskRatingHistogram from './TaskRatingHistogram';
import TaskLinkByTask from './TaskLinkByTask';
import { Task } from '../../models/taskModel';
import GreatestResult from '../result/GreatestResult';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const sortedTasks = tasks.slice();
  sortedTasks.sort((a, b) => ((a.name || '') > (b.name || '') ? 1 : -1));

  const rows = sortedTasks.map(
    ({
      alias, name, difficulty, rating, category,
    }) => ({
      id: alias,
      row: (
        <>
          <td>
            <TaskLinkByTask taskName={name || ''} alias={alias} />
          </td>
          <td>
            {category === undefined
              ? ''
              : category}
          </td>
          <td>
            {difficulty === undefined
              ? ''
              : <TaskDifficulty id={alias} difficulty={difficulty} />}
          </td>
          <td>
            {rating === undefined
              ? ''
              : <TaskRatingHistogram id={alias} rating={rating} />}
          </td>
          <td>
            <GreatestResult taskAlias={alias} />
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
