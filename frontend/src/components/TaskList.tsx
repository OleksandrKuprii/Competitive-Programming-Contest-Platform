import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import RatingHistogram, { Rating } from './RatingHistogram';
import Difficulty from './Difficulty';
import MyResult from './MyResult';


export interface Task {
  alias: string
  taskName: string
  category: string
  difficulty: number
  rating: Rating
  myresult: number
  description: { main: string, input_format: string, output_format: string },
  examples: { input: string, output: string }[],
  limits: { cpu_time: number, wall_time: number, memory: number }
}

function TaskList({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation();

  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="tasklist">
        <tr>
          {[t('tasklist.header.name'),
            t('tasklist.header.category'),
            t('tasklist.header.difficulty'),
            t('tasklist.header.rating'),
            t('tasklist.header.myresult')].map((header) => (
              <th style={{ fontSize: 18 }} key={uuid()}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map(({
          taskName, category, difficulty, rating, myresult, alias,
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
              <MyResult points={myresult} />
            </td>

          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TaskList;
