import { thunk, action } from 'easy-peasy';
import submissionFileModel from './submissionFileModel';
import submissions from '../submissions.json';
import { Submission } from '../components/SubmissionList';

const submissionModel = {
  list: submissions,
  file: submissionFileModel,

  addedSubmission: action((state: any, payload: Submission) => {
    state.list.push(payload);

    state.list.sort((a: any, b: any) => ((a.id > b.id) ? -1 : 1));
  }),

  submitSubmission: thunk(async (actions: any, payload: Submission) => {
    actions.addSubmission(payload);
  }),
};

export default submissionModel;
