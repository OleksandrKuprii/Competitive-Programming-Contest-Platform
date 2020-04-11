import {
  action, Action, State, thunk, Thunk, thunkOn, ThunkOn,
} from 'easy-peasy';
import sleep from '../utils/sleep';
import Injections from '../injections';
import { StoreModel } from './store';

export type Notification = {
  id: number,
  type: 'submitting',
  taskAlias: string,
}
|
{
  id: number,
  type: 'submitted',
  submissionId: string,
}
|
{
  id: number,
  type: 'receivedResults',
  submissionId: string,
  points: number,
  status: string[],
};

export interface NotificationModel {
  list: Array<Notification>,

  receivedNotification: Action<NotificationModel, Notification>,
  dismissedNotification: Action<NotificationModel, number>,

  addNotificationAndRemoveAfterDelay: Thunk<NotificationModel, Notification>,

  onSubmitRequested: ThunkOn<NotificationModel, Injections, StoreModel>,
  onSubmitted: ThunkOn<NotificationModel, Injections, StoreModel>,
}

const notificationModel: NotificationModel = {
  list: [],

  receivedNotification: action((state, notification) => {
    state.list.push(notification);
  }),

  dismissedNotification: action((state, id) => {
    // eslint-disable-next-line no-param-reassign
    state.list = state.list.filter((notification) => notification.id !== id);
  }),

  addNotificationAndRemoveAfterDelay: thunk(async (actions, notification) => {
    actions.receivedNotification(notification);

    await sleep(10 * 1000);

    actions.dismissedNotification(notification.id);
  }),

  onSubmitRequested: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.onSubmitRequested,
    (actions, target) => {
      actions.receivedNotification({
        id: +new Date(),
        type: 'submitting',
        taskAlias: target.payload,
      });
    },
  ),

  onSubmitted: thunkOn(
    (actions, storeActions) => storeActions.solutionSubmission.submit,
    (actions, target) => {

    },
  ),
};

export default notificationModel;
