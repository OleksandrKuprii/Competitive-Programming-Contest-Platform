import {
  thunk, action, Thunk, Action,
} from 'easy-peasy';
import submissionFileModel, { SubmissionFileModel } from './submissionFileModel';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';
import { fetchSubmission, submitSubmission } from './requests';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';

export interface Submission {
  id: number
  taskAlias: string
  language?: string
  status: string[]
  points?: number
  submitted?: string,
  tests?: { status: string, points: number, cpuTime: number, realtime: number }[],
  code?: string
}

export interface SubmissionModel {
  list: Submission[],
  file: SubmissionFileModel,
  addedSubmission: Action<SubmissionModel, Submission>,
  submitSubmission: Thunk<SubmissionModel,
  {
    taskAlias: string,
    code: string,
    language: string,
    token: string
  }>,
  fetchSubmission: Thunk<SubmissionModel, {
    id: number,
    token: string,
  }>,
}

const submissionModel: SubmissionModel = {
  list: [],
  file: submissionFileModel,

  addedSubmission: action((state, submission) => {
    updateObjectWithProperty(state.list, 'id', submission.id, submission);
  }),

  submitSubmission: thunk(async (actions,
    {
      taskAlias, code, language, token,
    }) => {
    const response = await submitSubmission(taskAlias, language, code, token);

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

  fetchSubmission: thunk(async (actions, { id, token }) => {
    const response = await fetchSubmission(id, token);

    const data: any = await response.json();

    actions.addedSubmission({
      id,
      taskAlias: data.alias,
      language: data.lang,
      submitted: data.timestamp,
      tests: data.tests,
      code: data.code,
      ...resultToPointsAndStatus(data.result),
    });
  }),
};

export default submissionModel;
