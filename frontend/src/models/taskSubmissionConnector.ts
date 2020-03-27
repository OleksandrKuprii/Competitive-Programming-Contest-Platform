import { Thunk, thunk } from 'easy-peasy';
import submissionModel, { SubmissionModel, Submission } from './submissionModel';
import taskModel, { TaskModel, Task } from './taskModel';
import baseURL from './apiBaseURL';

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


const resultToPointsAndStatus = (result: any) => {
  let points; let
    status = [];

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

export interface TaskSubmissionConnector {
  task: TaskModel,
  submission: SubmissionModel,
  fetchTasks: Thunk<TaskSubmissionConnector>,
  fetchTask: Thunk<TaskSubmissionConnector, string>
}

const taskSubmissionConnector: TaskSubmissionConnector = {
  task: taskModel,
  submission: submissionModel,


  fetchTasks: thunk(async (actions) => {
    const responce = await fetch(fetchTasksUrlBuilder({ userId: 0, number: 5, offset: 0 }));

    const data = await responce.json();

    data.forEach((element: any) => {
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

      actions.task.addedTask(task);

      if (element.best_submission.id === null) {
        return;
      }

      const { points, status } = resultToPointsAndStatus(element.best_submission.result);

      const submission: Submission = {
        taskAlias: element.alias,
        points,
        status,
        id: data.best_submission.id,
      };

      actions.submission.addedSubmission(submission);
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

    actions.task.addedTask(task);
  }),
};

export default taskSubmissionConnector;
