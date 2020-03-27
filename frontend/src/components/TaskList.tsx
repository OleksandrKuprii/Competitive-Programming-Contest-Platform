import * as React from 'react';
import CustomTable, { CustomTableRow } from './CustomTable';
import Difficulty from './Difficulty';
import RatingHistogram from './RatingHistogram';
import { GreatestResult } from './Result';
import { TaskNameLinkByTask } from './TaskNameLink';
import { Task } from '../models/taskModel';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const rows: CustomTableRow[] = tasks.map(
    ({
      alias, name, difficulty, rating, category,
    }) => ([
      (<TaskNameLinkByTask taskName={name} alias={alias} />),
      (category === undefined ? '' : category),
      (difficulty === undefined ? '' : <Difficulty difficulty={difficulty} />),
      (rating === undefined ? '' : <RatingHistogram rating={rating} />),
      (<GreatestResult taskAlias={alias} />),
    ]),
  );

  return (
    <CustomTable headers={['name', 'category', 'difficulty', 'rating', 'result']} rows={rows} />
  );
};

export default TaskList;
