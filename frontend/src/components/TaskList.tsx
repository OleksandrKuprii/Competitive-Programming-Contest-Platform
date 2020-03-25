import * as React from 'react';
import CustomTable, { CustomTableRow } from './CustomTable';
import Difficulty from './Difficulty';
import RatingHistogram, { Rating } from './RatingHistogram';
import { GreatestResult } from './Result';
import { TaskNameLinkByTask } from './TaskNameLink';


export interface Task {
  alias: string
  taskName: string
  category: string
  difficulty: number
  rating: Rating
  description: { main: string, input_format: string, output_format: string },
  examples: { input: string, output: string }[],
  limits: { cpu_time: number, wall_time: number, memory: number }
}

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const rows: CustomTableRow[] = tasks.map(
    ({
      alias, taskName, difficulty, rating, category,
    }) => ([
      (<TaskNameLinkByTask taskName={taskName} alias={alias} />),
      (category),
      (<Difficulty difficulty={difficulty} />),
      (<RatingHistogram rating={rating} />),
      (<GreatestResult taskAlias={alias} />),
    ]),
  );

  return (
    <CustomTable headers={['name', 'category', 'difficulty', 'rating', 'result']} rows={rows} />
  );
};

export default TaskList;
