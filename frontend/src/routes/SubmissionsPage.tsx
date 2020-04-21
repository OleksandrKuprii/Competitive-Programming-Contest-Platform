import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
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

  const nSubmissions = useStoreState((state) => state.submission.nItemsById);
  const submissionsLoading = useStoreState((state) => state.submission.loading.flag);

  const fetchSubmissions = useStoreActions((actions) => actions.submission.fetchRange);

  const submissions = nSubmissions(n);

  const loadMoreCallback = useCallback(() => {
    setN(n + 5);
  }, [n]);

  const needFetch = isAuthenticated && submissions.length < n;

  const fetchSubmissionsPagination = useCallback(() => {
    if (needFetch) {
      // TODO: Fix number increasing issue
      fetchSubmissions({ offset: submissions.length, number: n });
    }
  }, [n, fetchSubmissions, needFetch]);

  useEffect(() => {
    fetchSubmissionsPagination();
  }, [fetchSubmissionsPagination]);

  if (!isAuthenticated) {
    signIn();
    return <></>;
  }

  if (submissionsLoading) {
    return <Loading variant="loading" />;
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
