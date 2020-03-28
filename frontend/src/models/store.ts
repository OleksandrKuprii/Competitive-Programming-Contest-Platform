import taskSubmissionConnector, { TaskSubmissionConnector } from './taskSubmissionConnector';

export interface StoreModel {
  taskSubmission: TaskSubmissionConnector
}

const storeModel: StoreModel = {
  taskSubmission: taskSubmissionConnector,
};

export default storeModel;
