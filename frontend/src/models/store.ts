import auth0Model from './auth0Model';
import taskModel from './taskModel';
import submissionModel from './submissionModel';
import categoryModel from './categoryModel';
import solutionSubmissionModel from './solutionSubmissionModel';
import notificationModel from './notificationModel';
import submissionHunterModel from './submissionHunterModel';
import { Auth0ModelInitialState, StoreModel } from './interfaces';

const storeModel: (auth0ModelInitialState: Auth0ModelInitialState) => StoreModel = (
  auth0ModelInitialState,
) => ({
  auth0: auth0Model(auth0ModelInitialState),
  task: taskModel,
  category: categoryModel,
  submission: submissionModel,
  solutionSubmission: solutionSubmissionModel,
  notification: notificationModel,
  submissionHunter: submissionHunterModel,
});

export default storeModel;
