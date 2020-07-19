import * as React from 'react';
import {FC} from 'react';
import SubmissionList from '@/organisms/submissionList';
import WithLoading from '@/templates/withLoading';
import LoadingPage from '~/pages/fallback/LoadingPage';
import {useStoreState} from '~/hooks/store';
import Page from "@/toucanui/templates/page";

const SubmissionsPage: FC = () => {
  const submissions = useStoreState((state) => state.submission.submissions);
  const submissionsLoading = useStoreState(
    (state) => state.submission.loadingStatus,
  );

  return (
    <Page>
      <WithLoading loading={submissionsLoading} loadingNode={<LoadingPage/>}>
        <SubmissionList submissions={submissions}/>
      </WithLoading>
    </Page>
  );
};

export default SubmissionsPage;
