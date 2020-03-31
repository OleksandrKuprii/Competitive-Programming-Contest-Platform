import { action, Action } from 'easy-peasy';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';

export interface TaskRating {
  correct_percent: number,
  incorrect_percent: number,
  zero_points_percent: number
}

export interface Task {
  alias: string
  name: string
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
  addedTask: Action<TaskModel, Task>,
}

const taskModel: TaskModel = {
  list: [],

  addedTask: action((state, task) => {
    updateObjectWithProperty(state.list, 'alias', task.alias, task);
  }),

};

export default taskModel;
