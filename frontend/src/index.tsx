import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { createStore, StoreProvider } from 'easy-peasy';
import App from '~/App';
import i18n from '~/locales/i18n';
import storeModel from '~/models/store';
import '~/typings/index.d';

const main = async () => {
  const store = createStore(storeModel);

  ReactDOM.render(
    <StoreProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StoreProvider>,
    document.getElementById('root'),
  );
};

main().then();
