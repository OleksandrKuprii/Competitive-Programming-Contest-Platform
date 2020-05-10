import { actionOn, computed, thunk } from 'easy-peasy';
import baseURL from '~/models/apiBaseURL';
import resultToPointsAndStatus from '~/utils/resultToPointsAndStatus';
import { Category, TaskModel } from '~/models/interfaces';
import loadingModel from '~/models/loadingModel';
import updateObjectWithProperty from '~/utils/updateObjectWithProperty';

const taskModel: TaskModel = {
  ...loadingModel(),

  tasks: [],

  fetch: thunk(async (actions, { id }, { injections }) => {
    const endpoint = async () => {
      try {
        const token = await injections.auth0.getTokenSilently();

        return fetch(`${baseURL}/task/auth/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        return fetch(`${baseURL}/task/${id}`);
      }
    };

    const response = await endpoint();

    const body = await response.json();

    return {
      id,
      name: body.name,
      description: {
        main: body.main,
        inputFormat: body.input_format,
        outputFormat: body.output_format,
      },
      limits: {
        cpuTime: body.cpu_time_limit,
        wallTime: body.wall_time_limit,
        memory: body.memory_limit,
      },
      examples: body.examples.map((item: any) => ({
        input: item.input_data,
        output: item.output_data,
      })),
      customSections: body.custom_sections
        ? Object.entries(body.custom_sections).map((entry: any) => ({
            name: entry[0],
            data: entry[1],
          }))
        : [],
      publishedAt: body.created,
    };
  }),

  fetchAll: thunk(async (actions, _, { injections }) => {
    actions.loading();

    const endpoint = async () => {
      try {
        const token = await injections.auth0.getTokenSilently();

        return fetch(`${baseURL}/tasks/auth?offset=0&number=300`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        return fetch(`${baseURL}/tasks`);
      }
    };

    const response = await endpoint();

    if (!response.ok) {
      return [];
    }

    const body = await response.json();

    return body.map((task: any) => ({
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
      categoryId: task.category.alias,
      categoryName: task.category.name,
      submissionId: task.best_submission.id,
      ...resultToPointsAndStatus(task.best_submission.result),
    }));
  }),

  onFetched: actionOn(
    (actions) => actions.fetch.successType,
    (state, target) => {
      const task = target.result;

      updateObjectWithProperty(state.tasks, 'id', task.id, task);
    },
  ),

  onFetchedAll: actionOn(
    (actions) => actions.fetchAll.successType,
    (state, target) => {
      const tasks = target.result;

      if (Array.isArray(tasks)) {
        tasks.forEach((task) => {
          updateObjectWithProperty(state.tasks, 'id', task.id, task);
        });

        state.loadingStatus = false;
      }
    },
  ),

  onReceivedResults: actionOn(
    (actions, storeActions) => storeActions.submissionHunter.receivedResults,
    (state, target) => {
      const { points, status, id, taskId } = target.payload;

      const update = {
        submissionId: id,
        points,
        status,
      };

      updateObjectWithProperty(state.tasks, 'id', taskId, update);
    },
  ),

  categories: computed((state) => {
    const categories = state.tasks
      .filter(
        (task) =>
          task.categoryName !== undefined && task.categoryId !== undefined,
      )
      .map(
        (task): Category => ({
          id: task.categoryId as string,
          name: task.categoryName as string,
        }),
      );

    const hasId = new Set<string>();

    const uniqueCategories: Category[] = [];

    categories.forEach(({ id, name }) => {
      if (hasId.has(id)) {
        return;
      }

      hasId.add(id);
      uniqueCategories.push({ id, name });
    });

    return uniqueCategories;
  }),
};

export default taskModel;
