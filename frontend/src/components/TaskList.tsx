import * as React from 'react';
import CustomTable, { CustomTableRow } from './CustomTable';
import Difficulty from './Difficulty';
import RatingHistogram from './RatingHistogram';
import { GreatestResult } from './Result';
import { TaskNameLinkByTask } from './TaskNameLink';
import { Task } from '../models/taskModel';

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
            <TaskNameLinkByTask taskName={name || ''} alias={alias} />
          </td>
          <td>
            {category === undefined
              ? ''
              : category}
          </td>
          <td>
            {difficulty === undefined
              ? ''
              : <Difficulty id={alias} difficulty={difficulty} />}
          </td>
          <td>
            {rating === undefined
              ? ''
              : <RatingHistogram id={alias} rating={rating} />}
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
