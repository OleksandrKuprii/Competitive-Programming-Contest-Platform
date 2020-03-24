import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import { useStoreState } from 'easy-peasy';
import MyResult from './MyResult';
import prettyDate from '../utils/prettyDate';

export interface Submission {
  id: number
  taskAlias: string
  language: string
  status: string
  points: number
  submitted: number
}

const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const { t } = useTranslation();

  const taskNames = new Map<number, string>();

  useStoreState((state: any) => {
    submissions.forEach((submission) => {
      taskNames.set(submission.id, state.publictasks.find(
        (task: any) => task.alias === submission.taskAlias,
      ).taskName);
    });
  });


  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {[t('headers.id'),
            t('headers.task'),
            t('headers.language'),
            t('headers.myresult'),
            t('headers.submitted'),
          ].map((header) => (<th key={uuid()} style={{ fontSize: 18 }}>{header}</th>))}
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={uuid()}>
            <td>{submission.id}</td>

            <td>
              <Link to={`/task/view/${submission.taskAlias}`} style={{ color: 'white' }}>{taskNames.get(submission.id)}</Link>
            </td>
            <td>{submission.language}</td>
            <td>
              <MyResult points={submission.points} status={submission.status} />
            </td>
            <td>{prettyDate(submission.submitted)}</td>
          </tr>
        ))}

      </tbody>


    </Table>
  );
};

export default SubmissionList;
