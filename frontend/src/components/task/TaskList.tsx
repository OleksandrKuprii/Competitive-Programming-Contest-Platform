import * as React from 'react';
import CustomTable, { CustomTableRow } from '../table/CustomTable';
import TaskDifficulty from './TaskDifficulty';
import TaskLinkByTask from './TaskLinkByTask';
import CategoryName from '../category/CategoryName';
import { JoinedTask } from '../../models/interfaces';
import TaskRatingHistogram from './rating/TaskRatingHistogram';
import Result from '../result/Result';
import SubmissionLink from '../submission/SubmissionLink';

const TaskList = ({ tasks }: { tasks: JoinedTask[] }) => {
  const sortOptions = ['name', 'category', 'difficulty', 'result'];

  const rows = tasks.map(
    ({
      id,
      name,
      difficulty,
      rating,
      category,
      status,
      result,
      submissionId,
    }) =>
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
                <TaskDifficulty difficulty={difficulty} />
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
              {submissionId !== undefined ? (
                <SubmissionLink id={submissionId}>
                  <Result status={status} points={result} />
                </SubmissionLink>
              ) : undefined}
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
