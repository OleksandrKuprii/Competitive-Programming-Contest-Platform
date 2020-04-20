import * as React from 'react';
import CustomTable, { CustomTableRow } from '../CustomTable';
import SubmissionLink from './SubmissionLink';
import PrettyDate from '../PrettyDate';
import Result from '../result/Result';
import TaskLinkByAlias from '../task/TaskLinkByAlias';
import { Submission } from '../../models/interfaces';
import LanguageIdentifier from '../LanguageIdentifier';

const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const rows = submissions.map(
    ({ id, taskAlias, language, points, status, submitted }) =>
      ({
        id,
        row: (
          <>
            <td>
              <SubmissionLink id={id} />
            </td>
            <td>
              <TaskLinkByAlias id={taskAlias} />
            </td>
            <td>
              <LanguageIdentifier language={language || ''} size="sm" />
            </td>
            <td>
              <Result points={points} status={status} />
            </td>
            <td>
              <PrettyDate timestamp={submitted} />
            </td>
          </>
        ),
      } as CustomTableRow),
  );

  return (
    <CustomTable
      tableName="submissionList"
      headers={['id', 'task', 'language', 'result', 'submitted']}
      rows={rows}
    />
  );
};

export default SubmissionList;
