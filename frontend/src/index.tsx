import { createStore, StoreProvider } from 'easy-peasy';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import './bootstrap.scss';
import i18n from './i18n';
import './index.css';
import submissionFileModel from './models/submissionFileModel';
import publictasks from './publictasks.json';
import * as serviceWorker from './serviceWorker';
import submissions from './submissions.json';


const store = createStore({
  publictasks,
  submissions,
  submissionFile: submissionFileModel,
});

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </I18nextProvider>,
  document.getElementById('root'),
);
serviceWorker.unregister();
