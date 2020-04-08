import * as React from 'react';
import { Submission } from '../../models/submissionModel';
import CustomTable, { CustomTableRow } from '../CustomTable';
import SubmissionLink from './SubmissionLink';
import PrettyDate from '../PrettyDate';
import Result from '../result/Result';
import TaskLinkByAlias from '../task/TaskLinkByAlias';


const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const sortedSubmissions = submissions.slice();
  sortedSubmissions.sort((a, b) => (a.id > b.id ? -1 : 1));

  const rows = sortedSubmissions.map(({
    id, taskAlias, language, points, status, submitted,
  }) => ({
    id,
    row: (
      <>
        <td>
          <SubmissionLink id={id} />
        </td>
        <td>
          {taskAlias === undefined
            ? ''
            : <TaskLinkByAlias alias={taskAlias} />}
        </td>
        <td>
          {language === undefined
            ? ''
            : language}
        </td>
        <td>
          {status === undefined
            ? ''
            : (
              <Result
                points={points}
                status={status}
              />
            )}
        </td>
        <td>
          {submitted === undefined
            ? ''
            : <PrettyDate timestamp={submitted} />}
        </td>
      </>),
  } as CustomTableRow));

  return (
    <CustomTable tableName="submissionList" headers={['id', 'task', 'language', 'result', 'submitted']} rows={rows} />
  );
};

export default SubmissionList;
