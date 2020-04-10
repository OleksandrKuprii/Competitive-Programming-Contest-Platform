import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';
import Loading from '../components/Loading';


const SubmissionsPage = () => {
  const { t } = useTranslation();

  const submissions = useStoreState((state) => state.submission.items);
  const submissionsLoading = useStoreState((state) => state.submission.loading.flag);

  const fetchSubmissions = useStoreActions((actions) => actions.submission.fetchRange);

  useEffect(() => {
    if (submissionsLoading) {
      return;
    }

    fetchSubmissions({ offset: 0, number: 10 });
  }, []);

  if (submissionsLoading) {
    return <Loading />;
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
