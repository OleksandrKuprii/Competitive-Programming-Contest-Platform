import auth0Model from '~/models/auth0Model';
import taskModel from '~/models/taskModel';
import submissionModel from '~/models/submissionModel';
import solutionSubmissionModel from '~/models/solutionSubmissionModel';
import notificationModel from '~/models/notificationModel';
import submissionHunterModel from '~/models/submissionHunterModel';
import userModel from '~/models/userModel';
import myProfileEditModel from '~/models/myProfileEditModel';
import filterAndSortModel from '~/models/filterAndSort';
import { StoreModel } from '~/typings/models';

const storeModel: StoreModel = {
  auth0: auth0Model,
  myProfileEdit: myProfileEditModel,
  notification: notificationModel,
  solutionSubmission: solutionSubmissionModel,
  submission: submissionModel,
  submissionHunter: submissionHunterModel,
  task: taskModel,
  user: userModel,
  filterAndSort: filterAndSortModel,
};

export default storeModel;
