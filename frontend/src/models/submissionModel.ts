import {
  thunk, action, Thunk, Action,
} from 'easy-peasy';
import submissionFileModel, { SubmissionFileModel } from './submissionFileModel';
import baseURL from './apiBaseURL';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';
import sleep from '../utils/sleep';
import { fetchSubmissionUrlBuilder } from './requests';

export interface Submission {
  id: number
  taskAlias: string
  language?: string
  status: string[]
  points?: number
  submitted?: number,
  tests?: { status: string, points: number, cpuTime: number, realtime: number }[],
  code?: string
}

const submitSubmissionUrlBuilder = () => (
  `${baseURL}/submission`
);

export interface SubmissionModel {
  list: Submission[],
  file: SubmissionFileModel,
  addedSubmission: Action<SubmissionModel, Submission>,
  submitSubmission: Thunk<SubmissionModel, { taskAlias: string, code: string, language: string }>,
  fetchSubmission: Thunk<SubmissionModel, number>,
  huntSubmission: Thunk<SubmissionModel, number>,
}

const submissionModel: SubmissionModel = {
  list: [],
  file: submissionFileModel,

  addedSubmission: action((state, submission) => {
    updateObjectWithProperty(state.list, 'id', submission.id, submission);
  }),

  submitSubmission: thunk(async (actions,
    { taskAlias, code, language }) => {
    const response = await fetch(submitSubmissionUrlBuilder(), {
      method: 'POST',
      body: JSON.stringify({
        user_id: 1,
        alias: taskAlias,
        lang: language,
        code,
      }),
    });

    const data = await response.json();

    actions.addedSubmission({
      id: data.submission_id,
      taskAlias,
      language,
      points: undefined,
      status: ['Running'],
      submitted: data.timestamp,
      tests: [],
      code,
    } as Submission);
  }),

  fetchSubmission: thunk(async (actions, id) => {
    const response = await fetch(fetchSubmissionUrlBuilder({ id }));

    const data: any = await response.json();

    actions.addedSubmission({
      id,
      taskAlias: data.alias,
      language: data.lang,
      submitted: data.timestamp,
      tests: data.tests,
      code: data.code,
      status: [],
    });
  }),

  huntSubmission: thunk(async (actions, id) => {
    await sleep(5000);
  }),
};

export default submissionModel;
