import auth0Model from '~/models/auth0Model';
import taskModel from '~/models/taskModel';
import submissionModel from '~/models/submissionModel';
import solutionSubmissionModel from '~/models/solutionSubmissionModel';
import notificationModel from '~/models/notificationModel';
import submissionHunterModel from '~/models/submissionHunterModel';
import { Auth0ModelInitialState, StoreModel } from '~/models/interfaces';
import userModel from '~/models/userModel';

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
