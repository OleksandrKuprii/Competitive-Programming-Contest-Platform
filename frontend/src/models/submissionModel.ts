import { actionOn, thunk } from 'easy-peasy';
import baseURL from './apiBaseURL';
import resultToPointsAndStatus from '../utils/resultToPointsAndStatus';
import { Submission, SubmissionModel } from './interfaces';
import loadingModel from './loadingModel';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';

const submissionModel: SubmissionModel = {
  ...loadingModel(),

  submissions: [],

  fetch: thunk(async (actions, { id }, { injections }) => {
    try {
      const token = await injections.auth0.getTokenSilently();

      const response = await fetch(`${baseURL}/submission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await response.json();

      const submission: Submission = {
        id,
        taskId: body.alias,
        taskName: body.name,
        language: body.lang,
        ...resultToPointsAndStatus(body.result),
        code: body.code,
        tests: body.tests.map((test: any) => ({
          status: test.status,
          points: test.points,
          cpuTime: test.cpu_time,
          realTime: test.wall_time,
        })),
        testCount: body.tests_count,
      };

      return submission;
    } catch (e) {
      return { error: true };
    }
  }),

  fetchAll: thunk(async (actions, _, { injections }) => {
    actions.loading();

    try {
      const token = await injections.auth0.getTokenSilently();

      const response = await fetch(
        `${baseURL}/submissions?offset=0&number=300`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const body = await response.json();

      const submissions: Submission[] = body.map((item: any) => ({
        id: item.id,
        taskId: item.alias,
        taskName: item.name,
        submitted: new Date(item.published_at),
        language: item.lang,
        ...resultToPointsAndStatus(item.result),
        testCount: item.tests_count,
      }));

      return submissions;
    } catch (e) {
      return { error: true };
    }
  }),

  onFetched: actionOn(
    (actions) => actions.fetch.successType,
    (state, target) => {
      const submission = target.result;

      updateObjectWithProperty(
        state.submissions,
        'id',
        submission.id,
        submission,
      );
    },
  ),

  onFetchedAll: actionOn(
    (actions) => actions.fetchAll.successType,
    (state, target) => {
      const submissions = target.result;

      if (Array.isArray(submissions)) {
        submissions.forEach((submission) => {
          updateObjectWithProperty(
            state.submissions,
            'id',
            submission.id,
            submission,
          );
        });
      }

      state.loadingStatus = false;
    },
  ),

  onSubmitted: actionOn(
    (actions, storeActions) =>
      storeActions.solutionSubmission.submit.successType,
    (state, target) => {
      const submission = target.result;

      if (submission) {
        state.submissions.unshift(submission);
      }
    },
  ),
};

export default submissionModel;
