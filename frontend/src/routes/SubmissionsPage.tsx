import * as React from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import shallowEqual from 'shallowequal';
import { useStoreActions, useStoreState } from '../hooks/store';
import SubmissionList from '../components/submission/SubmissionList';
import Loading from '../components/Loading';

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

  const hasMoreSubmissions = useStoreState(
    (state) => state.submission.loading.hasMore,
  );

  const fetchSubmissions = useStoreActions(
    (actions) => actions.submission.fetchRange,
  );

  if (!isAuthenticated) {
    signIn();
    return <></>;
  }

  return (
    <>
      <p className="h3 m-0">{t('pageName.submissions')}</p>

      <p className="description">{t('submissionPage.description')}</p>
      <InfiniteScroll
        pageStart={-1}
        loadMore={(page) => {
          fetchSubmissions({ offset: page * 50, number: 50 });
        }}
        hasMore={hasMoreSubmissions}
        loader={<Loading variant="loading" />}
      >
        <SubmissionList submissions={submissions} />
      </InfiniteScroll>
    </>
  );
};

export default SubmissionsPage;
