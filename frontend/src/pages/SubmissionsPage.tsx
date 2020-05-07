import * as React from 'react';
import { FC } from 'react';
import SubmissionList from '../components/organisms/submissionList';
import WithLoading from '../components/templates/withLoading';
import { Submission } from '../models/interfaces';
import Loading from '../components/atoms/loading';

interface SubmissionsPageProps {
  submissions: Submission[];
  submissionsLoading: boolean;
}

const SubmissionsPage: FC<SubmissionsPageProps> = ({
  submissions,
  submissionsLoading,
}) => (
  <WithLoading
    loading={submissionsLoading}
    loadingNode={<Loading variant="loading" />}
  >
    <SubmissionList submissions={submissions} />
  </WithLoading>
);

export default SubmissionsPage;
