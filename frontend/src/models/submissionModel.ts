import {
  thunk, action, Thunk, Action,
} from 'easy-peasy';
import submissionFileModel, { SubmissionFileModel } from './submissionFileModel';
import baseURL from './apiBaseURL';

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
  fetchSubmissions: Thunk<SubmissionModel>,
}

export interface FetchSubmissionsUrlParams {
  number: number,
  offset: number,
}

const fetchSubmissionsUrlBuilder = ({ number, offset }: FetchSubmissionsUrlParams) => (
  `${baseURL}/submissions?number=${number}&offset=${offset}&user_id=1`
);

const submissionModel: SubmissionModel = {
  list: [],
  file: submissionFileModel,

  addedSubmission: action((state, submission) => {
    state.list.push(submission);
  }),

  submitSubmission: thunk(async (actions,
    { taskAlias, code, language }) => {
    const responce = await fetch(submitSubmissionUrlBuilder(), {
      method: 'POST',
      body: JSON.stringify({
        user_id: 1,
        task_id: 1,
        lang: language,
        code,
      }),
    });

    const data = JSON.parse(await responce.json());

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

  fetchSubmissions: thunk(async (actions) => {
    const response = await fetch(fetchSubmissionsUrlBuilder({ number: 5, offset: 0 }));
  }),
};

export default submissionModel;
