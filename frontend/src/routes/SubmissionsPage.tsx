import * as React from 'react';
import { useTranslation } from 'react-i18next';
import shallowEqual from 'shallowequal';
import { useStoreActions, useStoreState } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';
import Loading from '../components/layout/Loading';

const SubmissionsPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const signIn = useStoreActions((state) => state.auth0.signIn);

  const submissions = useStoreState(
    (state) =>
      state.submission.nItemsByCustomKeys([
        { key: (item) => item.id, option: 'desc' },
      ]),
    shallowEqual,
  );

  const submissionLoading = useStoreState(
    (state) => state.submission.loading.flag,
  );

  if (!isAuthenticated) {
    signIn();
    return <></>;
  }

  if (submissionLoading) {
    return <Loading variant="loading" />;
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
