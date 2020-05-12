import { action, computed, thunk } from 'easy-peasy';
import auth0Token from '~/models/auth0Token';
import baseURL from '~/models/apiBaseURL';
import { SolutionSubmissionModel } from '~/typings/models';

const solutionSubmissionModel: SolutionSubmissionModel = {
  ...auth0Token(),

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

  uploadFile: thunk(async (actions, file) => {
    const code = await file.text();
    const filename = file.name;

    actions.uploadedFile({ code, filename });
  }),

  submit: thunk(async (actions, taskId, { getState, getStoreState }) => {
    const { code, language } = getState();

    const token = await actions.getToken();

    actions.canceled();

    const response = await fetch(`${baseURL}/submission`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        alias: taskId,
        code,
        lang: language,
      }),
    });

    const body = await response.json();

    return {
      id: body.submission_id,
      submitted: new Date(body.timestamp),
      loading: true,
      language,
      taskId,
      taskName: getStoreState().task.tasks.find((t) => t.id === taskId)?.name,
      code,
    };
  }),
};

export default solutionSubmissionModel;
