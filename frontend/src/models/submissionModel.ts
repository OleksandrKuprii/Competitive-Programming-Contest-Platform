import { thunk, action } from 'easy-peasy';
import submissionFileModel from './submissionFileModel';
import baseURL from './common';

export interface Submission {
  id: number
  taskAlias: string
  language: string
  status: string[]
  points: number | undefined
  submitted: number,
  tests: { status: string, points: number, cputime: number, realtime: number }[],
  code: string
}

const submitSubmissionUrlBuilder = () => (
  `${baseURL}/submission`
);

const submissionModel = {
  list: [],
  file: submissionFileModel,

  addedSubmission: action((state: any, payload: Submission) => {
    state.list.push(payload);

    state.list.sort((a: any, b: any) => ((a.id > b.id) ? -1 : 1));
  }),

  submitSubmission: thunk(async (actions: any,
    { taskAlias, code, language }: { taskAlias: string, code: string, language: string }) => {
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
};

export default submissionModel;
