import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import { useStoreState } from 'easy-peasy';
import RatingHistogram, { Rating } from './RatingHistogram';
import Difficulty from './Difficulty';
import MyResult from './MyResult';
import { Submission } from './SubmissionList';


export interface Task {
  alias: string
  taskName: string
  category: string
  difficulty: number
  rating: Rating
  myresult: number
  status: string
  description: { main: string, input_format: string, output_format: string },
  examples: { input: string, output: string }[],
  limits: { cpu_time: number, wall_time: number, memory: number }
}

function TaskList({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation();

  const latestSubmissions = new Map<string, Submission | undefined>();

  useStoreState((state: any) => {
    const submissionsClone: Array<Submission> = [...state.submissions];

    submissionsClone.sort((a, b) => ((a.submitted > b.submitted) ? -1 : 1));

    tasks.forEach((task) => {
      const latestSubmission = submissionsClone.find(
        (submission) => submission.taskAlias === task.alias,
      );

      latestSubmissions.set(task.alias,
        latestSubmission === undefined ? undefined : latestSubmission);
    });
  });

  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {[t('headers.name'),
            t('headers.category'),
            t('headers.difficulty'),
            t('headers.rating'),
            t('headers.myresult')].map((header) => (
              <th style={{ fontSize: 18 }} key={uuid()}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map(({
          taskName, category, difficulty, rating, alias,
        }) => {
          const latestSubmission = latestSubmissions.get(alias);

          const points = latestSubmission?.points;
          const status = latestSubmission?.status;

          return (
            <tr key={uuid()}>
              <td>
                <Link to={`/task/view/${alias}`} style={{ color: 'white' }}>{taskName}</Link>
              </td>
              <td>{category}</td>
              <td>
                <Difficulty difficulty={difficulty} />
              </td>
              <td>
                <RatingHistogram rating={rating} />
              </td>
              <td>
                <MyResult points={points === undefined ? -1 : points} status={status === undefined ? 'UNKNOWN' : status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default TaskList;
