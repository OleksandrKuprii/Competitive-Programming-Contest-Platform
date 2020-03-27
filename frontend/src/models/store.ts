import taskModel, { TaskModel } from './taskModel';
import submissionModel, { SubmissionModel } from './submissionModel';

export interface StoreModel {
  task: TaskModel,
  submission: SubmissionModel
}

const storeModel: StoreModel = {
  task: taskModel,
  submission: submissionModel,
};

export default storeModel;
