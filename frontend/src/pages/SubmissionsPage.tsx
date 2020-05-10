import * as React from 'react';
import { FC } from 'react';
import SubmissionList from '@/organisms/submissionList';
import WithLoading from '@/templates/withLoading';
import { Submission } from '~/models/interfaces';
import LoadingPage from '~/pages/LoadingPage';

interface SubmissionsPageProps {
  submissions: Submission[];
  submissionsLoading: boolean;
}

const SubmissionsPage: FC<SubmissionsPageProps> = ({
  submissions,
  submissionsLoading,
}) => (
  <WithLoading loading={submissionsLoading} loadingNode={<LoadingPage />}>
    <SubmissionList submissions={submissions} />
  </WithLoading>
);

export default SubmissionsPage;