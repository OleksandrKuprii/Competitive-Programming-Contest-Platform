import * as React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import memoize from 'memoizee';
import { useStoreState } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import Loading from '../components/layout/Loading';
import TaskListFilterOptions from '../components/task/TaskListFilterOptions';
import { JoinedTask } from '../models/interfaces';

const joiner = memoize(
  (points?: number, id?: number, status?: string[]) => {
    return {
      result: points,
      zero: points === 0,
      partial: points !== undefined ? points > 0 && points < 100 : false,
      correct: points === 100,
      notStarted: points === undefined,
      submissionId: id,
      status,
    };
  },
  { primitive: true },
);

const getPointsPerTask = memoize(
  (
    submissions: {
      taskId?: string;
      points?: number;
      id: number;
      status?: string[];
    }[],
  ) => {
    const pointsPerTask = new Map<
      string,
      { id: number; points: number; status: string[] }
    >();

    submissions.forEach(({ taskId, points, id, status }) => {
      if (taskId === undefined || points === undefined) return;

      if (
        pointsPerTask.get(taskId) === undefined ||
        // @ts-ignore
        pointsPerTask.get(taskId).points < points
      ) {
        pointsPerTask.set(taskId, { id, points, status: status || [] });
      }
    });

    return pointsPerTask;
  },
  { primitive: true },
);

const TasksPage = () => {
  const keys = useStoreState(
    (store) =>
      store.sort.getKeys('task', {
        key: 'publishedAt',
        option: 'desc',
      }),
    shallowEqual,
  );

  const options = useStoreState(
    (store) => store.filter.getOptions('task'),
    shallowEqual,
  );

  const taskIds = useStoreState(
    (state) => state.task.items.map((item) => item.id),
    shallowEqual,
  );

  const submissions = useStoreState(
    (state) =>
      state.submission.items
        .filter(({ taskAlias }) =>
          taskAlias ? taskIds.includes(taskAlias) : false,
        )
        .map((submission) => ({
          taskId: submission.taskAlias,
          points: submission.points,
          id: submission.id,
          status: submission.status,
        })),
    shallowEqual,
  );

  const tasksLoading = useStoreState(
    (state) => state.task.loading.flag,
    shallowEqual,
  );

  const pointsPerTask = getPointsPerTask(submissions);

  const tasks = useStoreState(
    (state) =>
      state.task.nItemsByCustomKeys(keys, options, ({ id }) => {
        const item = pointsPerTask.get(id);

        return joiner(item?.points, item?.id, item?.status);
      }),
    shallowEqual,
  ) as JoinedTask[];

  if (tasksLoading) {
    return <Loading variant="loading" />;
  }

  return (
    <>
      <Row>
        <TaskListFilterOptions />
      </Row>

      <div style={{ padding: '10px 0' }} />

      <Row>
        <Col>
          <TaskList tasks={tasks} />
        </Col>
      </Row>
    </>
  );
};

export default TasksPage;
