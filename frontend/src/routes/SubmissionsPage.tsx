import * as React from 'react';
import { useTranslation } from 'react-i18next';
import shallowEqual from 'shallowequal';
import { useStoreActions, useStoreState } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';

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

  if (!isAuthenticated) {
    signIn();
    return <></>;
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
