import * as React from 'react';
import { FC, useEffect } from 'react';
import { useStoreActions, useStoreState } from '~/hooks/store';

const StartupFetcher: FC = () => {
  const auth0Loading = useStoreState((state) => state.auth0.loadingStatus);
  const authenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const fetchTasks = useStoreActions((actions) => actions.task.fetchAll);
  const fetchSubmissions = useStoreActions(
    (actions) => actions.submission.fetchAll,
  );
  const fetchMyProfile = useStoreActions(
    (actions) => actions.user.fetchMyProfile,
  );

  useEffect(() => {
    async function effect() {
      if (!auth0Loading) {
        await fetchTasks();

        if (authenticated) {
          await fetchSubmissions();
          await fetchMyProfile();
        }
      }
    }

    effect().then();
  }, [
    fetchTasks,
    fetchSubmissions,
    fetchMyProfile,
    auth0Loading,
    authenticated,
  ]);

  return <></>;
};

export default StartupFetcher;
