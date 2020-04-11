import * as React from 'react';
import {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { useStoreActions, useStoreState } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';
import Loading from '../components/Loading';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const [n, setN] = useState(5);

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const signIn = useStoreActions((state) => state.auth0.signIn);

  const nSubmissions = useStoreState((state) => state.submission.nItems);
  const submissionsLoading = useStoreState((state) => state.submission.loading.flag);

  const fetchSubmissions = useStoreActions((actions) => actions.submission.fetchRange);

  const submissions = nSubmissions(n);

  const loadMoreCallback = useCallback(() => {
    setN(n + 5);
  }, [n]);

  useEffect(() => {
    if (isAuthenticated && !submissionsLoading && submissions.length < n) {
      fetchSubmissions({ offset: 0, number: n });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions.length, n]);

  if (!isAuthenticated) {
    signIn();
    return <></>;
  }

  if (submissionsLoading) {
    return <Loading />;
  }

  return (
    <>
      <p className="h3 m-0">{t('pageName.submissions')}</p>

      <p className="description">{t('submissionPage.description')}</p>

      <SubmissionList submissions={submissions} />

      <Button onClick={loadMoreCallback}>Load more</Button>
    </>
  );
};

export default SubmissionsPage;
