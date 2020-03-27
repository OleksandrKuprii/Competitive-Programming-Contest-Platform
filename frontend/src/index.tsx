import { createStore, StoreProvider } from 'easy-peasy';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import './bootstrap.scss';
import i18n from './i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import submissionModel from './models/submissionModel';
import taskModel from './models/taskModel';


const store = createStore({
  task: taskModel,
  submission: submissionModel,
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
