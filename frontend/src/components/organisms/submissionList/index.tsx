import * as React from 'react';
import { useTranslation } from 'react-i18next';
import PrettyDate from '@/atoms/prettyDate';
import Result from '@/atoms/result';
import Defined from '@/helpers/defined';
import Link from '@/atoms/link';
import StyledTable from '@/molecules/table';
import { Submission } from '~/models/interfaces';

const SubmissionList = ({ submissions }: { submissions: Submission[] }) => {
  const { t } = useTranslation();

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{t('headers.id')}</th>
          <th>{t('headers.task')}</th>
          <th>{t('headers.language')}</th>
          <th>{t('headers.result')}</th>
          <th>{t('headers.submitted')}</th>
        </tr>
      </thead>

      <tbody>
        {submissions.map(
          ({ id, taskId, taskName, language, points, status, submitted }) => (
            <tr key={id}>
              <td>
                <Link href={`#/submission/view/${id}`}>{id}</Link>
              </td>
              <td>
                <Link href={`#/task/view/${taskId}`}>{taskName}</Link>
              </td>
              <td>{language}</td>
              <td>
                <Defined value={status}>
                  {(definedStatus) => (
                    <Defined value={points}>
                      {(definedPoints) => (
                        <Result status={definedStatus} points={definedPoints} />
                      )}
                    </Defined>
                  )}
                </Defined>
              </td>
              <td>
                <PrettyDate timestamp={submitted} />
              </td>
            </tr>
          ),
        )}
      </tbody>
    </StyledTable>
  );
};

export default SubmissionList;
