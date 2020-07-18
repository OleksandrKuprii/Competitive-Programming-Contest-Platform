import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Result from '@/atoms/result';
import Link from '@/toucanui/atoms/link';
import StyledTable from '@/molecules/table';
import { Submission } from '~/typings/entities/submission';
import PrettyDate from "@/toucanui/atoms/prettyDate";

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
                {(status && points) && <Result status={status} points={points} />}
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
