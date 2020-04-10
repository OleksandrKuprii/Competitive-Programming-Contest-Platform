import auth0Model, { Auth0Model, Auth0ModelInitialState } from './auth0Model';
import taskModel, { TaskModel } from './taskModel';
import submissionModel, { SubmissionModel } from './submissionModel';
import categoryModel, { CategoryModel } from './categoryModel';
import solutionSubmissionModel, { SolutionSubmissionModel } from './solutionSubmissionModel';

export interface StoreModel {
  auth0: Auth0Model,
  task: TaskModel,
  category: CategoryModel,
  submission: SubmissionModel,
  solutionSubmission: SolutionSubmissionModel,
}

const storeModel: (auth0ModelInitialState: Auth0ModelInitialState) => StoreModel = (
  auth0ModelInitialState,
) => ({
  auth0: auth0Model(auth0ModelInitialState),
  task: taskModel,
  category: categoryModel,
  submission: submissionModel,
  solutionSubmission: solutionSubmissionModel,
});

export default storeModel;
