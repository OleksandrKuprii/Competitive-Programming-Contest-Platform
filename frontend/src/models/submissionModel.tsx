import {
  thunk, action, Thunk, Action,
} from 'easy-peasy';
import submissionFileModel, { SubmissionFileModel } from './submissionFileModel';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';
import { fetchSubmission, submitSubmission } from './requests';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import loadingModel, { LoadingModel } from './loadingModel';
import sleep from '../utils/sleep';
import mapTestsFromApi from './mapTestsFromApi';
import notificationModel, {
  NotificationModel,

} from './notificationModel';

export interface Submission {
  id: number
  taskAlias?: string
  loading: boolean
  language?: string
  status?: string[]
  points?: number
  submitted?: string,
  tests?: { status: string, points: number, cpuTime: number, realtime: number }[],
  code?: string
}

export interface SubmissionModel {
  list: Submission[],
  file: SubmissionFileModel,
  notification: NotificationModel,
  loading: LoadingModel,
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
  huntSubmission: Thunk<SubmissionModel, {
    id: number,
    token: string
  }>,
}

const submissionModel: SubmissionModel = {
  list: [],
  file: submissionFileModel,

  notification: notificationModel(),
  loading: loadingModel(),

  addedSubmission: action((state, submission) => {
    updateObjectWithProperty(state.list, 'id', submission.id, submission);
  }),

  submitSubmission: thunk(async (actions,
    {
      taskAlias, code, language, token,
    }) => {
    const submittingNotificationId = +new Date();

    actions.notification.receivedNotification({
      id: submittingNotificationId,
      type: 'submitting',
      taskAlias,
    });

    const response = await submitSubmission(taskAlias, language, code, token);

    const data = await response.json();

    actions.addedSubmission({
      id: data.submission_id,
      taskAlias,
      language,
      loading: false,
      points: undefined,
      status: ['Received'],
      submitted: data.timestamp,
      tests: [],
      code,
    } as Submission);

    setTimeout(() => actions.notification.dismissedNotification(submittingNotificationId), 1000);

    actions.notification.addNotificationAndRemoveAfterDelay({
      id: +new Date(),
      type: 'submitted',
      submissionId: data.submission_id,
    });

    actions.huntSubmission({
      id: data.submission_id,
      token,
    });
  }),

  fetchSubmission: thunk(async (actions, { id, token }) => {
    actions.addedSubmission({
      id,
      loading: true,
    });

    const response = await fetchSubmission(id, token);

    const data: any = await response.json();

    actions.addedSubmission({
      id,
      taskAlias: data.alias,
      loading: false,
      language: data.lang,
      submitted: data.timestamp,
      tests: mapTestsFromApi(data.tests),
      code: data.code,
      ...resultToPointsAndStatus(data.result),
    });
  }),

  huntSubmission: thunk(async (actions, idAndToken, { getStoreState }) => {
    await sleep(5000);

    await actions.fetchSubmission(idAndToken);

    const submissionWithId = (getStoreState() as any).taskSubmission.submission.list.find(
      (submission: Submission) => submission.id === idAndToken.id,
    );

    if (!submissionWithId) {
      await actions.huntSubmission(idAndToken);
      return;
    }

    if (!submissionWithId.tests || submissionWithId.tests?.length === 0) {
      await actions.huntSubmission(idAndToken);
      return;
    }

    actions.notification.addNotificationAndRemoveAfterDelay({
      id: +new Date(),
      type: 'receivedResults',
      submissionId: submissionWithId.id,
      points: submissionWithId.points,
      status: submissionWithId.status,
    });
  }),
};

export default submissionModel;
