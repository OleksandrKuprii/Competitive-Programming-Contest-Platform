import {
  action, thunk, Action, Thunk,
} from 'easy-peasy';
import baseURL from './apiBaseURL';

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

interface FetchTasksUrlParams {
  userId: number,
  number: number,
  offset: number
}

interface FetchTaskUrlParams {
  alias: string
}

const fetchTasksUrlBuilder = ({ userId, number, offset }: FetchTasksUrlParams) => (
  `${baseURL}/tasks?user_id=${userId}&number=${number}&offset=${offset}`
);

const fetchTaskUrlBuilder = ({ alias }: FetchTaskUrlParams) => (
  `${baseURL}/task/${alias}`
);

// const resultToPointsAndStatus = (result: any) => {
//   let points; let
//     status = [];

//   if (result == null) {
//     points = null;
//   } else {
//     points = result.points;

//     if (Array.isArray(result.status)) {
//       status = result.status;
//     } else {
//       status.push(result.status);
//     }
//   }

//   return { points, status };
// };

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
  fetchTasks: Thunk<TaskModel>,
  fetchTask: Thunk<TaskModel, string>
}

const taskModel: TaskModel = {
  list: [],

  addedTask: action((state, task) => {
    updateObjectWithProperty(state.list, 'alias', task.alias, task);
  }),

  fetchTasks: thunk(async (actions) => {
    const responce = await fetch(fetchTasksUrlBuilder({ userId: 0, number: 5, offset: 0 }));

    const data = await responce.json();

    data.forEach((element: any) => {
      // const { points, status } = resultToPointsAndStatus(element.result);

      const task: Task = {
        alias: element.alias,
        name: element.name,
        difficulty: element.difficulty,
        category: element.category,
        rating: { correct_percent: 0, incorrect_percent: 0, zero_points_percent: 0 },
        examples: [],
        limits: {
          cpuTime: 0,
          memory: 0,
          wallTime: 0,
        },
      };

      actions.addedTask(task);
    });
  }),

  fetchTask: thunk(async (actions, alias) => {
    const response = await fetch(fetchTaskUrlBuilder({ alias }));

    const data = await response.json();

    // const { points, status } = resultToPointsAndStatus(data.result);

    const task: Task = {
      alias,
      name: data.name,
      examples: data.examples.map((
        /* eslint-disable */
        { input_data, output_data }: { input_data: string, output_data: string },
        /* eslint-enable */
      ) => ({ input: input_data, output: output_data })),
      description: {
        main: data.main,
        inputFormat: data.input_format,
        outputFormat: data.output_format,
      },
      limits: {
        cpuTime: data.cpu_time_limit,
        memory: data.memory_limit,
        wallTime: data.wall_time_limit,
      },
    };

    actions.addedTask(task);
  }),
};

export default taskModel;
