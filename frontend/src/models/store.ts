import taskSubmissionConnector, { TaskSubmissionConnector } from './taskSubmissionConnector';
import auth0Model, { Auth0Model } from './auth0Model';

export interface StoreModel {
  auth0: Auth0Model
  taskSubmission: TaskSubmissionConnector
}

const storeModel: StoreModel = {
  auth0: auth0Model,
  taskSubmission: taskSubmissionConnector,
};

export default storeModel;
