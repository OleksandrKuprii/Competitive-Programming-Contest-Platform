import { action, thunk, thunkOn } from 'easy-peasy';
import sleep from '../utils/sleep';
import { NotificationModel } from './interfaces';

const notificationModel: NotificationModel = {
  list: [],

  receivedNotification: action((state, notification) => {
    state.list.push(notification);
  }),

  dismissedNotification: action((state, id) => {
    // eslint-disable-next-line no-param-reassign
    state.list = state.list.filter((notification) => notification.id !== id);
  }),

  addNotificationAndRemoveAfterDelay: thunk(async (actions, { notification, delay }) => {
    const { id } = notification;
    actions.receivedNotification(notification);

    await sleep(delay || 10 * 1000);

    actions.dismissedNotification(id);
  }),

  onSubmitRequested: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.onSubmitRequested,
    (actions, target) => {
      actions.addNotificationAndRemoveAfterDelay({
        notification: {
          id: +new Date(),
          type: 'submitting',
          taskAlias: target.payload,
        },
        delay: 1000,
      });
    },
  ),

  onSubmitted: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.submit,
    (actions, target) => {
      actions.addNotificationAndRemoveAfterDelay({
        notification: {
          id: +new Date(),
          type: 'submitted',
          submissionId: target.result.submission.id,
        },
      });
    },
  ),

  onReceivedResults: thunkOn(
    (actions, storeActions) => storeActions.submissionHunter.receivedResults,
    (actions, target) => {
      const submission = target.payload;

      actions.addNotificationAndRemoveAfterDelay({
        notification: {
          id: +new Date(),
          type: 'receivedResults',
          submissionId: submission.id,
          status: submission.status === undefined ? [] : submission.status,
          points: submission.points === undefined ? -1 : submission.points,
        },
      });
    },
  ),
};

export default notificationModel;
