import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import './bootstrap.scss';
import { createStore, StoreProvider } from 'easy-peasy';
import publictasks from './publictasks.json';
import submissionFileModel from './models/submissionFileModel';

import i18n from './i18n';

const store = createStore({
    publictasks,
    submissionFile: submissionFileModel
});

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    </I18nextProvider>,
    document.getElementById('root'));
serviceWorker.unregister();
