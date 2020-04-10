import {
  action, Action, thunk, Thunk,
} from 'easy-peasy';
import sleep from '../utils/sleep';

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
}

const notificationModel: () => NotificationModel = () => ({
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
});

export default notificationModel;
