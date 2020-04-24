import dataModel from './generalizers/dataModel';
import baseURL from './apiBaseURL';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import { Category, Submission, Task, TaskModel } from './interfaces';

const taskModel: TaskModel = {
  ...dataModel<string, Task>({
    dataItemFetcher: async (id, args) => {
      const { token } = args;

      const response = await fetch(
        `${baseURL}/${token ? 'task/auth' : 'task'}/${id}`,
        {
          headers: !token
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              },
        },
      );

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();

      return {
        item: {
          id,
          name: data.name,
          loading: false,
          description: {
            main: data.main,
            inputFormat: data.input_format,
            outputFormat: data.output_format,
          },
          limits: {
            cpuTime: data.cpu_time_limit,
            wallTime: data.wall_time_limit,
            memory: data.memory_limit,
          },
          examples: data.examples.map((item: any) => ({
            input: item.input_data,
            output: item.output_data,
          })),
          customSections: data.custom_sections
            ? Object.entries(data.custom_sections).map((entry: any) => ({
                name: entry[0],
                data: entry[1],
              }))
            : [],
          publishedAt: data.created,
        } as Task,
      };
    },
    dataRangeFetcher: async (range, args) => {
      const { token } = args;

      const options = [`offset=${range.offset}`, `number=${range.number}`];

      const response = await fetch(
        `${baseURL}/${token ? 'tasks/auth' : 'tasks'}?${options.join('&')}`,
        {
          headers: !token
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              },
        },
      );

      if (!response.ok) {
        return [];
      }

      const tasks = await response.json();

      return tasks.map((task: any) => ({
        item: {
          id: task.alias,
          name: task.name,
          category: task.category.alias,
          difficulty: task.difficulty,
          rating: {
            correct: task.statistics.full,
            partial: task.statistics.partial,
            zero: task.statistics.zero,
          },
          publishedAt: task.created,
        } as Task,
        category: {
          id: task.category.alias,
          name: task.category.name,
        } as Category,
        submission:
          task.best_submission.id === null
            ? undefined
            : ({
                id: task.best_submission.id,
                taskAlias: task.alias,
                ...resultToPointsAndStatus(task.best_submission.result),
              } as Submission),
      }));
    },

    onChangedManyTargets: (state, storeActions) => [
      storeActions.submission.fetchRange,
    ],
    onChangedOneTargets: (state, storeActions) => [
      storeActions.submission.fetchOne,
    ],

    dataModelIdentifier: 'task',
  }),
};

export default taskModel;
