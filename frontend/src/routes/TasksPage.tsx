import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import CategoryFilter from '../components/table/filters/CategoryFilter';
import IntRangeFilter from '../components/table/filters/IntRangeFilter';
import Loading from '../components/layout/Loading';

const TasksPage = () => {
  const { t } = useTranslation();

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

  const allTasks = useStoreState((state) => state.task.items, shallowEqual);

  const taskIds = allTasks.map((task) => task.id);

  const submissions = useStoreState(
    (state) =>
      state.submission.items
        .filter(({ taskAlias }) =>
          taskAlias ? taskIds.includes(taskAlias) : false,
        )
        .map((submission) => ({
          taskId: submission.taskAlias,
          points: submission.points,
        })),
    shallowEqual,
  );

  const pointsPerTask = new Map<string, number>();

  submissions.forEach(({ taskId, points }) => {
    if (taskId === undefined || points === undefined) return;

    if (
      !pointsPerTask.has(taskId) ||
      // @ts-ignore
      pointsPerTask.get(taskId) < points
    ) {
      pointsPerTask.set(taskId, points);
    }
  });

  const tasks = useStoreState(
    (state) =>
      state.task.nItemsByCustomKeys(keys, options, (item) => ({
        result: pointsPerTask.get(item.id),
      })),
    shallowEqual,
  );

  const tasksLoading = useStoreState((state) => state.task.loading.flag);

  const changedOption = useStoreActions(
    (actions) => actions.filter.changedOption,
  );

  if (tasksLoading) {
    return <Loading variant="loading" />;
  }

  return (
    <>
      <Row>
        <Col>
          <p className="h3 m-0 d-inline">{t('pageName.tasks')}</p>
        </Col>
      </Row>

      <div style={{ padding: '10px 0' }} />

      <Row>
        <Col md="auto">
          <CategoryFilter />
        </Col>
        <Col md="auto">
          <IntRangeFilter
            header="Difficulty"
            from={1}
            to={10}
            onFinalChange={(values) => {
              changedOption({
                tableName: 'task',
                name: 'difficulty',
                value: {
                  from: values[0],
                  to: values[1],
                },
              });
            }}
          />
        </Col>
        <Col md="auto" />
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
