import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState, useStoreActions } from '../hooks/store';
import SubmissionList from '../components/SubmissionList';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const submissions = useStoreState(state => state.taskSubmission.submission.list);

  const fetchSubmisions = useStoreActions(actions => actions.taskSubmission.submission);

  return (
    <>
      <h1>{t('pagename.submissions')}</h1>

      <p>{t('submissionPage.description')}</p>

      <SubmissionList submissions={submissions} />
    </>
  );
};

export default SubmissionsPage;
