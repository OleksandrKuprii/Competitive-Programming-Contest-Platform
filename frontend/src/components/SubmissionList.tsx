import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import MyResult from './MyResult';
import StatusColor from './StatusColor';
import prettyDate from '../utils/prettyDate';

export interface Submission {
  id: number
  taskName: string
  language: string
  status: string
  points: number
  submitted: number
  alias: string
}

function SubmissionPage({ submissions }: { submissions: Submission[] }) {
  const { t } = useTranslation();

  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {[t('submissionPage.header.id'),
            t('submissionPage.header.task'),
            t('submissionPage.header.language'),
            t('submissionPage.header.status'),
            t('submissionPage.header.points'),
            t('submissionPage.header.submitted'),
          ].map((header) => (<th style={{ fontSize: 18 }}>{header}</th>))}
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={uuid()}>
            <td>{submission.id}</td>

            <td>
              <Link to={`/task/view/${submission.alias}`} style={{ color: 'white' }}>{submission.taskName}</Link>
            </td>
            <td>{submission.language}</td>
            <td>
              <StatusColor points={submission.points} status={submission.status} />
            </td>
            <td>
              <MyResult points={submission.points} />
            </td>
            <td>{prettyDate(submission.submitted)}</td>
          </tr>
        ))}

      </tbody>


    </Table>
  );
}

export default SubmissionPage;
