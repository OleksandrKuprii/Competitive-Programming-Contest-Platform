import { action, Action } from 'easy-peasy';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';
import loadingModel, { LoadingModel } from './loadingModel';

export interface TaskRating {
  correct_percent: number,
  incorrect_percent: number,
  zero_points_percent: number
}

export interface Task {
  alias: string
  loading: boolean
  name?: string
  category?: string
  difficulty?: number
  rating?: TaskRating
  description?: {
    main?: string,
    inputFormat?: string,
    outputFormat?: string
  },
  examples?: { input: string, output: string }[],
  limits?: {
    cpuTime?: number,
    wallTime?: number,
    memory?: number
  }
}

export interface TaskModel {
  list: Task[],
  loading: LoadingModel,
  addedTask: Action<TaskModel, Task>,
}

const taskModel: TaskModel = {
  list: [],
  loading: loadingModel(),

  addedTask: action((state, task) => {
    updateObjectWithProperty(state.list, 'alias', task.alias, task);
  }),
};

export default taskModel;
