import { action, computed, thunkOn } from 'easy-peasy';
import sleep from '../utils/sleep';
import { SubmissionHunterModel } from './interfaces';

const submissionHunterModel: SubmissionHunterModel = {
  nowHunting: new Set(),

  isHunting: computed((state) => (id) => state.nowHunting.has(id)),

  startedHunting: action((state, id) => {
    state.nowHunting.add(id);
  }),

  receivedResults: action((state, submission) => {
    state.nowHunting.delete(submission.id);
  }),

  onSubmit: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.submit,
    async (actions, target, { getStoreActions }) => {
      const { id } = target.result.submission;

      actions.startedHunting(id);

      const fetchSubmission = getStoreActions().submission.fetchOne;

      let submission;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(5000);

        // eslint-disable-next-line no-await-in-loop
        submission = (await fetchSubmission(id)).item;

        if (submission && submission.tests) {
          if (submission.tests.length > 0) {
            break;
          }
        }
      }

      actions.receivedResults(submission);
    },
  ),
};

export default submissionHunterModel;
