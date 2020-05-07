import auth0Model from './auth0Model';
import taskModel from './taskModel';
import submissionModel from './submissionModel';
import solutionSubmissionModel from './solutionSubmissionModel';
import notificationModel from './notificationModel';
import submissionHunterModel from './submissionHunterModel';
import { Auth0ModelInitialState, StoreModel } from './interfaces';
import userModel from './userModel';

const storeModel: (
  auth0ModelInitialState: Auth0ModelInitialState,
) => StoreModel = (auth0ModelInitialState) => ({
  auth0: auth0Model(auth0ModelInitialState),
  task: taskModel,
  submission: submissionModel,
  solutionSubmission: solutionSubmissionModel,
  notification: notificationModel,
  submissionHunter: submissionHunterModel,
  user: userModel,
});

export default storeModel;
