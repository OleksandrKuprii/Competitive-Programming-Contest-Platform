import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import WithLoading from '@/templates/withLoading';
import createAuth0Client from '@auth0/auth0-spa-js';
import { useStoreState, useStoreActions } from '~/hooks/store';
import auth0Config from '~/auth0.config.json';
import LoadingPage from '~/pages/fallback/LoadingPage';

interface Auth0ProviderProps {
  children: ReactNode;
}

const Auth0Provider: FC<Auth0ProviderProps> = ({ children }) => {
  const auth0Loading = useStoreState((state) => state.auth0.loadingStatus);

  const {
    authenticated,
    loaded,
    createdClient,
  } = useStoreActions((actions) => ({ ...actions.auth0 }));

  useEffect(() => {
    async function effect() {
      const client = await createAuth0Client(auth0Config);

      createdClient(client);

      if (
        window.location.search.includes('code=') &&
        window.location.search.includes('state=')
      ) {
        await client.handleRedirectCallback();
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.hash,
        );
      }

      if (await client.isAuthenticated()) {
        authenticated();
      }

      loaded();
    }

    effect().then();
  }, [createdClient, authenticated, loaded]);

  return (
    <WithLoading
      loading={auth0Loading}
      loadingNode={<LoadingPage customText="Checking your identity." />}
    >
      {children}
    </WithLoading>
  );
};

export default Auth0Provider;
