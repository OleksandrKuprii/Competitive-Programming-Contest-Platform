import { Thunk, thunk } from 'easy-peasy';
import submissionModel, { Submission, SubmissionModel } from './submissionModel';
import taskModel, { Task, TaskModel } from './taskModel';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import {
  fetchSubmission, fetchSubmissions, fetchTask, fetchTasks,
} from './requests';


export interface TaskSubmissionConnector {
  task: TaskModel,
  submission: SubmissionModel,
  fetchTasks: Thunk<TaskSubmissionConnector, {
    token?: string,
  }>,
  fetchTask: Thunk<TaskSubmissionConnector, {
    alias: string,
    token?: string,
  }>,
  fetchSubmissions: Thunk<TaskSubmissionConnector, {
    token: string,
  }>,
  fetchSubmission: Thunk<TaskSubmissionConnector, {
    id: number,
    token: string,
  }>,
}

const taskSubmissionConnector: TaskSubmissionConnector = {
  task: taskModel,
  submission: submissionModel,

  fetchTasks: thunk(async (actions, { token }, { getStoreState }) => {
    if ((getStoreState() as any).taskSubmission.task.loading.loading) {
      return;
    }

    actions.task.loading.changedLoadingStatus(true);

    const response = await fetchTasks(token);

    const data = await response.json();

    data.forEach((element: any) => {
      const task: Task = {
        alias: element.alias,
        loading: false,
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
        loading: false,
        points,
        status,
        id: element.best_submission.id,
      };

      actions.submission.addedSubmission(submission);
    });

    actions.task.loading.changedLoadingStatus(false);
  }),

  fetchTask: thunk(async (actions, { alias, token }) => {
    actions.task.addedTask({
      alias,
      loading: true,
    });

    const response = await fetchTask(alias, token);

    const data = await response.json();

    const task: Task = {
      alias,
      name: data.name,
      loading: false,
      examples: data.examples.map((
        /* eslint-disable */
        {input_data, output_data}: { input_data: string, output_data: string },
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

    const { points, status } = resultToPointsAndStatus(data.best_submission.result);

    if (!points || !status) {
      return;
    }

    const submission: Submission = {
      id: data.best_submission.id,
      loading: false,
      taskAlias: alias,
      points,
      status,
    };

    actions.submission.addedSubmission(submission);
  }),

  fetchSubmissions: thunk(async (actions, { token }, { getStoreState }) => {
    if ((getStoreState() as any).taskSubmission.submission.loading.loading) {
      return;
    }

    actions.submission.loading.changedLoadingStatus(true);

    const response = await fetchSubmissions(token);

    const submissions: {
      id: number,
      lang: string,
      alias: string,
      name: string,
      published_at: string,
      result: any
    }[] = await response.json();

    if (submissions !== undefined) {
      submissions.forEach(({
        id,
        alias,
        name,
        // eslint-disable-next-line
        published_at,
        result,
        lang,
      }) => {
        actions.submission.addedSubmission({
          id,
          loading: false,
          taskAlias: alias,
          submitted: published_at,
          ...resultToPointsAndStatus(result),
          language: lang,
        });

        actions.task.addedTask({
          alias,
          loading: false,
          name,
        });
      });
    }

    actions.submission.loading.changedLoadingStatus(false);
  }),

  fetchSubmission: thunk(async (actions, { id, token }) => {
    actions.submission.addedSubmission({
      id,
      loading: true,
    });

    const response = await fetchSubmission(id, token);

    const data: any = await response.json();

    actions.submission.addedSubmission({
      id,
      loading: false,
      taskAlias: data.alias,
      language: data.lang,
      submitted: data.timestamp,
      tests: data.tests.map((test: any) => ({
        status: test.status,
        points: test.points,
        cpuTime: test.cpu_time,
        realtime: test.wall_time,
      })),
      code: data.code,
      ...resultToPointsAndStatus(data.result),
    });

    actions.task.addedTask({
      alias: data.alias,
      loading: false,
      name: data.name,
    });
  }),
};

export default taskSubmissionConnector;
