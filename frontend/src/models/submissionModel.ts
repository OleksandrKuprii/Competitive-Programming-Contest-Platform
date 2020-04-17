import dataModel from './generalizers/dataModel';
import baseURL from './apiBaseURL';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import { Submission, SubmissionModel, Task } from './interfaces';

const submissionModel: SubmissionModel = {
  ...dataModel<number, Submission>({
    dataItemFetcher: async (id, args) => {
      const { token } = args;

      if (!token) {
        return { item: { id, loading: false } };
      }

      const response = await fetch(`${baseURL}/submission/${id}`, {
        headers: !token
          ? {}
          : {
              Authorization: `Bearer ${token}`,
            },
      });

      const body = await response.json();

      return {
        item: {
          id,
          loading: false,
          submitted: new Date(body.timestamp),
          taskAlias: body.alias,
          language: body.lang,
          ...resultToPointsAndStatus(body.result),
          tests: body.tests.map((test: any) => ({
            status: test.status,
            points: test.points,
            cpuTime: test.cpu_time,
            realtime: test.wall_time,
          })),
          code: body.code,
        } as Submission,
        task: {
          id: body.alias,
          name: body.name,
        } as Task,
      };
    },
    dataRangeFetcher: async (range, args) => {
      const { token } = args;

      if (!token) {
        return [];
      }

      const response = await fetch(
        `${baseURL}/submissions?offset=${range.offset}&number=${range.number}`,
        {
          headers: !token
            ? {}
            : {
                Authorization: `Bearer ${token}`,
              },
        },
      );

      const body = await response.json();

      return body.map((item: any) => ({
        item: {
          id: item.id,
          taskAlias: item.alias,
          loading: false,
          submitted: new Date(item.published_at),
          language: item.lang,
          ...resultToPointsAndStatus(item.result),
        } as Submission,
        task: {
          id: item.alias,
          name: item.name,
        } as Task,
      }));
    },

    onChangedManyTargets: (state, storeActions) => [storeActions.task.fetchRange],
    onChangedOneTargets: (state, storeActions) => [storeActions.solutionSubmission.submit],

    dataModelIdentifier: 'submission',
  }),
};

export default submissionModel;
