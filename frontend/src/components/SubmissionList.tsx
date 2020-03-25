import * as React from 'react';
import { Submission } from '../models/submissionModel';
import CustomTable, { CustomTableRow } from './CustomTable';
import SubmissionIDLink from './SubmissionIDLink';
import { TaskNameLinkByAlias } from './TaskNameLink';
import PrettyDate from './PrettyDate';
import { Result } from './Result';


const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const rows: CustomTableRow[] = submissions.map(({
    id, taskAlias, language, points, status, submitted,
  }) => ([
    (<SubmissionIDLink id={id} />),
    (<TaskNameLinkByAlias alias={taskAlias} />),
    (language),
    (<Result points={points} status={status} />),
    (<PrettyDate timestamp={submitted} />),
  ]));

  return (
    <CustomTable headers={['id', 'task', 'language', 'result', 'submitted']} rows={rows} />
  );
};

export default SubmissionList;
