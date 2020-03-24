import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';
import SubmissionList from '../components/SubmissionList';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const submissions = useStoreState((state) => state.submission.list);

  return (
    <>
      <h1>{t('pagename.submissions')}</h1>

      <p>{t('submissionPage.description')}</p>

      <SubmissionList submissions={submissions} />
    </>
  );
};

export default SubmissionsPage;
