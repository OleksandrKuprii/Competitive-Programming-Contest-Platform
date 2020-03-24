import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import Difficulty from './Difficulty';
import RatingHistogram, { Rating } from './RatingHistogram';
import { GreatestResult } from './Result';


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

function TaskList({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation();

  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {[t('headers.name'),
            t('headers.category'),
            t('headers.difficulty'),
            t('headers.rating'),
            t('headers.result')].map((header) => (
              <th style={{ fontSize: 18 }} key={uuid()}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map(({
          taskName, category, difficulty, rating, alias,
        }) => (
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
              <GreatestResult taskAlias={alias} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TaskList;
