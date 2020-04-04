import * as React from 'react';
import { Submission } from '../models/submissionModel';
import CustomTable, { CustomTableRow } from './CustomTable';
import SubmissionIDLink from './SubmissionIDLink';
import { TaskNameLinkByAlias } from './TaskNameLink';
import PrettyDate from './PrettyDate';
import { Result } from './Result';


const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const sortedSubmissions = submissions.slice();
  sortedSubmissions.sort((a, b) => (a.id > b.id ? -1 : 1));

  const rows: CustomTableRow[] = sortedSubmissions.map(({
    id, taskAlias, language, points, status, submitted,
  }) => ([
    (<SubmissionIDLink id={id} />),
    (taskAlias === undefined ? '' : <TaskNameLinkByAlias alias={taskAlias} />),
    (language === undefined ? '' : language),
    (status === undefined ? '' : <Result points={points} status={status} />),
    (submitted === undefined ? '' : <PrettyDate timestamp={submitted} />),
  ]));

  return (
    <CustomTable headers={['id', 'task', 'language', 'result', 'submitted']} rows={rows} />
  );
};

export default SubmissionList;
