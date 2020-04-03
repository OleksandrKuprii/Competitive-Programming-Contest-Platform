import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import SubmissionList from '../components/SubmissionList';
import ErrorPage from "./ErrorPage";


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);
  const submissions = useStoreState((state) => (state.taskSubmission.submission.list));

  const fetchSubmissions = useStoreActions((actions) => actions.taskSubmission.fetchSubmissions);
  const doAuth = useStoreActions((actions) => actions.auth0.doAuth);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    // eslint-disable-next-line
    fetchSubmissions({ token: token });
  }, [fetchSubmissions, isAuthenticated, token]);

  if (!isAuthenticated) {
    doAuth({});
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
