import * as React from 'react';
import { FC } from 'react';
import SubmissionList from '@/organisms/submissionList';
import WithLoading from '@/templates/withLoading';
import LoadingPage from '~/pages/LoadingPage';
import { useStoreState } from '~/hooks/store';

const SubmissionsPage: FC = () => {
  const submissions = useStoreState((state) => state.submission.submissions);
  const submissionsLoading = useStoreState(
    (state) => state.submission.loadingStatus,
  );

  return (
    <WithLoading loading={submissionsLoading} loadingNode={<LoadingPage />}>
      <SubmissionList submissions={submissions} />
    </WithLoading>
  );
};

export default SubmissionsPage;
