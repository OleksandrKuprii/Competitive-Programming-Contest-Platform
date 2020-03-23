import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import Points from './Points';
import StatusColor from './StatusColor';

export interface Submission {
  id: number
  taskName: string
  language: string
  status: string
  points: string
  submitted: string
  alias: string
}

function SubmissionPage({ submissions }: { submissions: Submission[] }) {
  const { t } = useTranslation();

  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="submissionlist">
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
              <StatusColor status={submission.status} points={submission.points} />
            </td>
            <td>
              <Points points={submission.points} />
            </td>
            <td>{submission.submitted}</td>
          </tr>
        ))}

      </tbody>


    </Table>
  );
}

export default SubmissionPage;
