import { action, thunk } from 'easy-peasy';
import loadingModel from './generalizers/loadingModel';
import baseURL from './apiBaseURL';
import { SolutionSubmissionModel, Submission } from './interfaces';

const solutionSubmissionModel: SolutionSubmissionModel = {
  loading: loadingModel(),

  selectedLanguage: action((state, language) => ({
    code: state.code,
    filename: state.filename,
    language,
    loading: state.loading,
  })),

  uploadedFile: action((state, { code, filename }) => ({
    code,
    filename,
    language: state.language,
    loading: {
      flag: state.loading.flag,
    },
  })),

  canceled: action((state) => ({
    code: undefined,
    filename: undefined,
    language: undefined,
    loading: {
      flag: state.loading.flag,
    },
  })),

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
        lang: language || 'python3',
      }),
    });

    const body = await response.json();

    return {
      submission: ({
        id: body.submission_id,
        submitted: new Date(body.timestamp),
        loading: true,
      } as Submission),
    };
  }),
};

export default solutionSubmissionModel;