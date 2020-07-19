import * as React from 'react';
import {useTranslation} from 'react-i18next';
import Result from '@/atoms/result';
import {Table, TableCol} from '@/toucanui/molecules/table';
import {Submission} from '~/typings/entities/submission';
import PrettyDate from "@/toucanui/atoms/prettyDate";
import {Link} from "react-router-dom";

const SubmissionList = ({submissions}: { submissions: Submission[] }) => {
  const {t} = useTranslation();

  return (
    <Table cols={5}>
      <TableCol header>{t('headers.id')}</TableCol>
      <TableCol header>{t('headers.task')}</TableCol>
      <TableCol header>{t('headers.language')}</TableCol>
      <TableCol header>{t('headers.result')}</TableCol>
      <TableCol header>{t('headers.submitted')}</TableCol>

      {submissions.map(
        ({id, taskId, taskName, language, points, status, submitted}) => (
          <React.Fragment key={id}>
            <TableCol>
              <Link to={`/submission/view/${id}`}>{id}</Link>
            </TableCol>
            <TableCol>
              <Link to={`/task/view/${taskId}`}>{taskName}</Link>
            </TableCol>
            <TableCol>{language}</TableCol>
            <TableCol>
              {(status && points) && <Result status={status} points={points}/>}
            </TableCol>
            <TableCol>
              <PrettyDate timestamp={submitted}/>
            </TableCol>
          </React.Fragment>
        ),
      )}
    </Table>
  );
};

export default SubmissionList;
