import { action, Action } from 'easy-peasy';

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
  limits: {
    cpuTime?: number,
    wallTime?: number,
    memory?: number
  }
}

interface StringIndexSignature {
  [key: string]: any
}

function updateObjectWithProperty(arr: StringIndexSignature[],
  key: string, value: any, newObj: any) {
  const objWithProperty = arr.find((obj) => value === obj[key]);

  if (objWithProperty === undefined) {
    arr.push(newObj);
    return;
  }

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] !== undefined) {
      objWithProperty[k] = newObj[k];
    }
  });
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
