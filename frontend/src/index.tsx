import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { createStore, StoreProvider } from 'easy-peasy';
import createAuth0Client from '@auth0/auth0-spa-js';
import App from './App';
import './styles/index.scss';
import i18n from './i18n';
import * as serviceWorker from './serviceWorker';
import storeModel from './models/store';
// eslint-disable-next-line import/extensions
import './types/index.d.ts';

const main = async () => {
  const auth0 = await createAuth0Client({
    domain: 'dev-gly-dk66.eu.auth0.com',
    client_id: 'w5IiSiIhAoOW8dQvAATlvbaS2eP47H0Q',
    audience: 'toucan-api',
  });

  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash,
    );
  }

  const isAuthenticated = await auth0.isAuthenticated();

  let user;
  let username;
  let avatar;

  if (isAuthenticated) {
    user = await auth0.getUser();

    avatar = user.picture;
    username = user.name;
  }

  const store = createStore(
    storeModel({
      isAuthenticated,
      user,
      avatar,
      username,
    }),
    {
      injections: {
        auth0,
      },
    },
  );

  ReactDOM.render(
    <StoreProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StoreProvider>,
    document.getElementById('root'),
  );
  serviceWorker.unregister();
};

main().then();
