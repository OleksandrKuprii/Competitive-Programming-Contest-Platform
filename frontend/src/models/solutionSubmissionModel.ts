import {
  action, Action, Thunk, thunk,
} from 'easy-peasy';
import loadingModel, { LoadingModel } from './generalizers/loadingModel';
import Injections from '../injections';
import baseURL from "./apiBaseURL";
import {Submission, SubmissionModel} from "./submissionModel";

export interface SolutionSubmissionModel {
  code?: string;
  filename?: string;
  language?: string;

  loading: LoadingModel,

  selectedLanguage: Action<SolutionSubmissionModel, string>,
  uploadedFile: Action<SolutionSubmissionModel, { code: string, filename: string }>
  canceled: Action<SolutionSubmissionModel>,

  uploadFile: Thunk<SolutionSubmissionModel, File>,
  submit: Thunk<SolutionSubmissionModel, undefined, Injections>,
}

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
    loading: state.loading,
  })),

  canceled: action((state) => ({
    code: undefined,
    filename: undefined,
    language: undefined,
    loading: state.loading,
  })),

  uploadFile: thunk(async (actions, file) => {
    actions.loading.loading();

    const code = await file.text();
    const filename = file.name;

    actions.uploadedFile({ code, filename });

    actions.loading.loaded();
  }),

  submit: thunk(async (actions, payload, { injections, getState }) => {
    const { code, language } = getState();

    let token;

    try {
      token = await injections.auth0.getTokenSilently();
    } catch {}

    const response = await fetch(`${baseURL}/submission`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        alias: 'coins',
        code,
        lang: language || 'python3',
      }),
    });

    const body = await response.json();

    console.log(body);

    return {
      submission: ({
        id: body.submission_id,
        submitted: new Date(body.timestamp),
      } as Submission),
    };
  }),
};

export default solutionSubmissionModel;
