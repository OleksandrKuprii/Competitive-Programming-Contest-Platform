import { useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import { Submission } from '../models/submissionModel';
import { Result } from './Result';
import PrettyDate from './PrettyDate';


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
              <Result points={submission.points} status={submission.status} />
            </td>
            <td><PrettyDate timestamp={submission.submitted} /></td>
          </tr>
        ))}

      </tbody>


    </Table>
  );
};

export default SubmissionList;
