import { action, thunk } from 'easy-peasy';
import { baseURL } from './common';

export interface TaskRating {
  correct_percent: number,
  incorrect_percent: number,
  zero_points_percent: number
}

export interface Task {
  alias: string
  name: string
  category: string | undefined
  difficulty: number | undefined
  rating: TaskRating | undefined
  description: {
    main: string | undefined,
    inputFormat: string | undefined,
    outputFormat: string | undefined
  },
  examples: { input: string, output: string }[],
  limits: {
    cpuTime: number | undefined,
    wallTime: number | undefined,
    memory: number | undefined
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
)

const resultToPointsAndStatus = (result: any) => {
  let points, status = [];

  if (result == null) {
    points = null;
  } else {
    points = result.points;

    if (Array.isArray(result.status)) {
      status = result.status;
    } else {
      status.push(result.status);
    }
  }

  return { points, status };
};

const taskModel = {
  list: [],

  addedTask: action((state: any, task) => {
    let taskWithAlias = state.list.find(({ alias }: Task) => alias === task.alias);

    if (taskWithAlias === undefined) {
      state.list.push(task);
    } else {
      for (const key in task) {
        if (task[key] !== undefined) {
          taskWithAlias[key] = task[key];
        }
      }
    }
  }),

  fetchTasks: thunk(async (actions: any) => {
    const responce = await fetch(fetchTasksUrlBuilder({ userId: 0, number: 5, offset: 0 }));

    const data = await responce.json();

    data.forEach((element: any) => {
      const { points, status } = resultToPointsAndStatus(element.result);

      const task: Task = {
        alias: element.alias,
        name: element.name,
        difficulty: element.difficulty,
        category: element.category,
        rating: { correct_percent: 0, incorrect_percent: 0, zero_points_percent: 0 },
        examples: [],
        description: {
          main: '',
          inputFormat: '',
          outputFormat: '',
        },
        limits: {
          'cpuTime': 0,
          'memory': 0,
          'wallTime': 0
        }
      };

      actions.addedTask(task);
    });
  }),

  fetchTask: thunk(async (actions: any, alias: string) => {
    const response = await fetch(fetchTaskUrlBuilder({ alias }));

    const data = await response.json();

    const { points, status } = resultToPointsAndStatus(data.result);

    console.log(data);

    const task: Task = {
      alias,
      name: data.name,
      difficulty: undefined,
      category: undefined,
      rating: undefined,
      examples: data.examples.map(({ input_data, output_data }: { input_data: string, output_data: string }) =>
        ({ input: input_data, output: output_data })),
      description: {
        main: data.main,
        inputFormat: data.input_format,
        outputFormat: data.output_format,
      },
      limits: {
        'cpuTime': data.cpu_time_limit,
        'memory': data.memory_limit,
        'wallTime': data.wall_time_limit
      }
    };

    actions.addedTask(task);
  }),
};

export default taskModel;
