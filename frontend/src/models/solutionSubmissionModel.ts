import { action, computed, thunk } from 'easy-peasy';
import loadingModel from '~/models/loadingModel';
import baseURL from '~/models/apiBaseURL';
import { SolutionSubmissionModel } from '~/models/interfaces';

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

  uploadFile: thunk(async (actions, file) => {
    actions.loading.loading();

    const code = await file.text();
    const filename = file.name;

    actions.uploadedFile({ code, filename });

    actions.loading.loaded();
  }),

  submit: thunk(
    async (actions, taskId, { injections, getState, getStoreState }) => {
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
    },
  ),
};

export default solutionSubmissionModel;
