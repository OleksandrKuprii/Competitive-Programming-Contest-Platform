import { thunk, action } from 'easy-peasy';
import submissionFileModel from './submissionFileModel';
import submissions from '../submissions.json';

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

const submissionModel = {
  list: submissions,
  file: submissionFileModel,

  addedSubmission: action((state: any, payload: Submission) => {
    state.list.push({ ...payload, code: state.file.fileText, language: state.file.language });

    state.list.sort((a: any, b: any) => ((a.id > b.id) ? -1 : 1));
  }),

  submitSubmission: thunk(async (actions: any,
    { taskAlias }: { taskAlias: string }) => {
    actions.addedSubmission({
      id: new Date().getTime(),
      taskAlias,
      language: '',
      points: undefined,
      status: [],
      submitted: new Date().getTime() / 1000,
      tests: [],
      code: '',
    } as Submission);
  }),
};

export default submissionModel;
