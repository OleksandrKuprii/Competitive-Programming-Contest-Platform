import { thunk, Thunk, thunkOn } from 'easy-peasy';
import dataModel, { DataModel, ObjectWithId } from './generalizers/dataModel';
import baseURL from './apiBaseURL';
import { Category } from './categoryModel';
import { Submission } from './submissionModel';
import resultToPointsAndStatus from "../utils/resultToPointsAndStatus";

export interface TaskRating {
  correct: number,
  partiallyCorrect: number,
  zeroPointAnswer: number
}

export interface TaskExample {
  input: string,
  output: string,
}

export interface TaskLimits {
  cpuTime: number,
  wallTime: number,
  memory: number,
}

export interface Task extends ObjectWithId {
  name?: string,
  category?: string,
  difficulty?: number,
  rating: TaskRating,
  description?: {
    main?: string,
    inputFormat?: string,
    outputFormat?: string,
  },
  examples?: TaskExample[],
  limits?: TaskLimits,
}

export interface TaskModel extends DataModel<Task> {
  updateTaskCategory: Thunk<TaskModel, Category>
}

const taskModel: TaskModel = {
  ...dataModel<Task>({
    dataItemFetcher: async (id, args) => {
      const { token } = args;

      const response = await fetch(`${baseURL}/${token ? 'task/auth' : 'task'}/${id}`, {
        headers: !token ? {} : {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

      return {
        item: {
          id,
          name: data.name,
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
          }))
        },
      };
    },
    dataRangeFetcher: async (range, args) => {
      const { token } = args;

      const response = await fetch(`${baseURL}/${token ? 'tasks/auth' : 'tasks'}?offset=${range.offset}&number=${range.number}`, {
        headers: !token ? {} : {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasks = await response.json();

      return tasks.map((task: any) => ({
        item: ({
          id: task.alias,
          name: task.name,
          category: task.category.alias,
          difficulty: task.difficulty,
        } as Task),
        category: ({
          id: task.category.alias,
          name: task.category.name,
        } as Category),
        submission: (task.best_submission.id === null ? undefined : {
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

  updateTaskCategory: thunk((actions, category) => category),
};

export default taskModel;
