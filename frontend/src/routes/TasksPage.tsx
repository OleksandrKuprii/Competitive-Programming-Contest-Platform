import * as React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import CategoryFilter from '../components/table/filters/CategoryFilter';
import IntRangeFilter from '../components/table/filters/IntRangeFilter';
import Loading from '../components/layout/Loading';
import CheckboxFilter from '../components/table/filters/CheckboxFilter';

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
      state.task.nItemsByCustomKeys(keys, options, (item) => {
        const points = pointsPerTask.get(item.id);

        return {
          result: points,
          zero: points === 0,
          partial: points !== undefined ? points > 0 && points < 100 : false,
          correct: points === 100,
          notStarted: points === undefined,
        };
      }),
    shallowEqual,
  );

  const tasksLoading = useStoreState((state) => state.task.loading.flag);

  const changedOption = useStoreActions(
    (actions) => actions.filter.changedOption,
  );
  const deletedOption = useStoreActions(
    (actions) => actions.filter.deletedOption,
  );

  const getOption = useStoreState((state) => state.filter.getOption);

  const difficulty = getOption('task', 'difficulty') as {
    from: number;
    to: number;
  };

  if (tasksLoading) {
    return <Loading variant="loading" />;
  }

  return (
    <>
      <Row>
        <Col md="3">
          <CategoryFilter />
        </Col>
        <Col md="3">
          <IntRangeFilter
            header="difficulty"
            from={1}
            to={10}
            initialValues={[difficulty?.from || 1, difficulty?.to || 10]}
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
        <Col md="6">
          <CheckboxFilter
            header="result"
            labelClassNames={[
              'text-success',
              'text-warning',
              'text-danger',
              'text-disabled',
            ]}
            onClick={(values) => {
              const names = ['correct', 'partial', 'zero', 'notStarted'];

              for (let i = 0; i < 4; i += 1) {
                if (values[i]) {
                  deletedOption({
                    tableName: 'task',
                    name: names[i],
                  });
                } else {
                  changedOption({
                    tableName: 'task',
                    name: names[i],
                    value: false,
                  });
                }
              }
            }}
            checked={['correct', 'partial', 'zero', 'notStarted'].map(
              (name) => {
                const option = getOption('task', name) as boolean;

                if (option === undefined) {
                  return true;
                }

                return option;
              },
            )}
            options={[
              {
                header: 'showSolved',
              },
              {
                header: 'showPartiallySolved',
              },
              {
                header: 'showZeroSolved',
              },
              {
                header: 'showNotStarted',
              },
            ]}
          />
        </Col>
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
