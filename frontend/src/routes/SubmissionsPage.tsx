import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';
import Loading from '../components/Loading';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);
  const submissions = useStoreState((state) => (state.taskSubmission.submission.list));
  const authLoading = useStoreState((state) => state.auth0.loading.loading);
  const submissionsLoading = useStoreState(
    (state) => state.taskSubmission.submission.loading.loading,
  );

  const fetchSubmissions = useStoreActions((actions) => actions.taskSubmission.fetchSubmissions);
  const doAuth = useStoreActions((actions) => actions.auth0.doAuth);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !token) {
      doAuth({});
      return;
    }

    fetchSubmissions({ token });
  }, [fetchSubmissions, isAuthenticated, token, authLoading, doAuth]);

  if (authLoading || submissionsLoading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <p className="h3 m-0">{t('pageName.submissions')}</p>

      <p className="description">{t('submissionPage.description')}</p>

      <SubmissionList submissions={submissions} />
    </>
  );
};

export default SubmissionsPage;
