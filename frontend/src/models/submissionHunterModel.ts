import { action, computed, thunkOn } from 'easy-peasy';
import sleep from '../utils/sleep';
import { Submission, SubmissionHunterModel } from './interfaces';

const checkSubmissions = (
  submissions: Submission[],
  alreadyHunting: Set<number>,
) =>
  submissions
    .filter(({ status }) =>
      status ? status[0] === 'Running' || status[0] === 'Received' : true,
    )
    .filter(({ id }) => !alreadyHunting.has(id));

const submissionHunterModel: SubmissionHunterModel = {
  nowHunting: new Set(),

  isHunting: computed((state) => (id) => state.nowHunting.has(id)),

  startedHunting: action((state, id) => {
    state.nowHunting.add(id);
  }),

  receivedResults: action((state, submission) => {
    state.nowHunting.delete(submission.id);
  }),

  checkSubmissions: action(() => {}),

  onSubmit: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.submit,
    (actions, target) => {
      const { id } = target.result;

      actions.startedHunting(id);
    },
  ),

  onStartedHunting: thunkOn(
    (actions) => actions.startedHunting,
    async (actions, target, { getStoreActions }) => {
      const id = target.payload;

      const fetchSubmission = getStoreActions().submission.fetch;

      let submission;

      const MAX_RETRIES = 10;

      let i = 0;

      for (; i < MAX_RETRIES; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(5000);

        // eslint-disable-next-line no-await-in-loop
        submission = (await fetchSubmission({ id })) as any;

        if (submission && submission.tests) {
          if (submission.tests.length >= submission.testCount) {
            break;
          }
        }
      }

      if (i === MAX_RETRIES) {
        submission.status = ['Unknown error'];
      }

      actions.receivedResults(submission);
    },
  ),

  onCheckSubmissions: thunkOn(
    (actions) => actions.checkSubmissions,
    async (actions, target, { getStoreState, getState }) => {
      const alreadyHunting = getState().nowHunting as Set<number>;
      const { submissions } = getStoreState().submission;

      const toHunt = checkSubmissions(submissions, alreadyHunting);

      toHunt.forEach(({ id }) => {
        actions.startedHunting(id);
      });
    },
  ),
};

export default submissionHunterModel;
