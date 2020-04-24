import { action, computed, thunk } from 'easy-peasy';
import loadingModel from './generalizers/loadingModel';
import baseURL from './apiBaseURL';
import { SolutionSubmissionModel, Submission } from './interfaces';

const solutionSubmissionModel: SolutionSubmissionModel = {
  loading: loadingModel(),

  language: 'python3',

  fileUploaded: computed((state) => state.code !== undefined),

  selectedLanguage: action((state, language) => {
    state.language = language;
  }),

  uploadedFile: action((state, { code, filename }) => {
    state.code = code;
    state.filename = filename;
    state.fileUploaded = true;
  }),

  canceled: action((state) => {
    state.code = undefined;
    state.filename = undefined;
    state.fileUploaded = false;
  }),

  onSubmitRequested: action(() => {}),

  uploadFile: thunk(async (actions, file) => {
    actions.loading.loading();

    const code = await file.text();
    const filename = file.name;

    actions.uploadedFile({ code, filename });

    actions.loading.loaded();
  }),

  submit: thunk(async (actions, taskAlias, { injections, getState }) => {
    actions.onSubmitRequested(taskAlias);

    const { code, language } = getState();

    actions.canceled();

    let token;

    try {
      token = await injections.auth0.getTokenSilently();
    } catch {
      token = undefined;
    }

    const response = await fetch(`${baseURL}/submission`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        alias: taskAlias,
        code,
        lang: language,
      }),
    });

    const body = await response.json();

    return {
      submission: {
        id: body.submission_id,
        submitted: new Date(body.timestamp),
        loading: true,
      } as Submission,
    };
  }),
};

export default solutionSubmissionModel;
