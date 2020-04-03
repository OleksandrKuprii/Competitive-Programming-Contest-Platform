import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import SubmissionList from '../components/SubmissionList';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);
  const submissions = useStoreState((state) => (state.taskSubmission.submission.list));

  const fetchSubmissions = useStoreActions((actions) => actions.taskSubmission.fetchSubmissions);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    // eslint-disable-next-line
    fetchSubmissions({ token: token });
  }, [fetchSubmissions, isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <h3>Please login to view submissions!</h3>
    );
  }

  return (
    <>
      <h1>{t('pageName.submissions')}</h1>

      <p>{t('submissionPage.description')}</p>

      <SubmissionList submissions={submissions} />
    </>
  );
};

export default SubmissionsPage;
