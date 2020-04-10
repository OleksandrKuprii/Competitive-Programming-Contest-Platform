import { thunkOn, ThunkOn } from 'easy-peasy';
import dataModel, { DataModel, ObjectWithId } from './generalizers/dataModel';
import baseURL from './apiBaseURL';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import { Task } from './taskModel';

export interface SubmissionTest {
  status: string;
  points: number;
  cpuTime: number;
  realtime: number;
}

export interface Submission extends ObjectWithId {
  taskAlias?: string
  language?: string
  status?: string[]
  points?: number
  submitted?: Date,
  tests?: SubmissionTest[],
  code?: string
}

export interface SubmissionModel extends DataModel<Submission> {}

const submissionModel: SubmissionModel = {
  ...dataModel<Submission>({
    dataItemFetcher: async (id, args) => {
      const { token } = args;

      if (!token) {
        return { item: { id } };
      }

      const response = await fetch(`${baseURL}/submission/${id}`, {
        headers: !token ? {} : {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await response.json();

      console.log(body);

      return {
        item: {
          id,
        },
      };
    },
    dataRangeFetcher: async (range, args) => {
      const { token } = args;

      if (!token) {
        return [];
      }

      const response = await fetch(`${baseURL}/submissions?offset=${range.offset}&number=${range.number}`, {
        headers: !token ? {} : {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await response.json();

      return body.map((item: any) => ({
        item: ({
          id: item.id,
          taskAlias: item.alias,
          submitted: new Date(item.published_at),
          language: item.lang,
          ...resultToPointsAndStatus(item.result),
        } as Submission),
        task: ({
          id: item.alias,
          name: item.name,
        } as Task),
      }));
    },

    onChangedManyTargets: (state, storeActions) => [
      storeActions.task.fetchRange,
    ],
    onChangedOneTargets: (state, storeActions) => [
      storeActions.solutionSubmission.submit,
    ],

    dataModelIdentifier: 'submission',
  }),
};

export default submissionModel;
