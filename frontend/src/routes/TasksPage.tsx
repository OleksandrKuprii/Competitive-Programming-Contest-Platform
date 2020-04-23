import * as React from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import { useCallback } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import Loading from '../components/Loading';
import TableShowOptions from '../components/TableShowOptions';
import zip from '../utils/zip';
import { AscDescOrNone } from '../models/interfaces';

const TasksPage = () => {
  const { t } = useTranslation();

  const hasMoreTasks = useStoreState((state) => state.task.loading.hasMore);

  const fetchTasks = useStoreActions((actions) => actions.task.fetchRange);

  const sortOptions = ['name', 'category', 'difficulty', 'result'];

  const options = useStoreState(
    (state) =>
      sortOptions.map((header) => state.sort.getOption('task', header)),
    shallowEqual,
  );

  const keys = zip(sortOptions, options)
    .map(([name, option]) => {
      if (!option) return undefined;

      return { key: (item: any) => item[name as any] as any, option };
    })
    .filter((item) => item !== undefined);

  if (keys.length === 0) {
    keys.push({ key: (item) => item.publishedAt, option: 'desc' });
  }

  const tasks = useStoreState(
    (state) => state.task.nItemsByCustomKeys(keys as any),
    shallowEqual,
  );

  const sortBy = zip(sortOptions, options).map(([name, option]) => {
    return { name: name as string, option: option as AscDescOrNone };
  });

  const onApply = useCallback(() => {
    fetchTasks({
      offset: 0,
      number: 5,
      sortBy,
    });
  }, [sortBy]);

  return (
    <>
      <Row>
        <Col>
          <p className="h3 m-0 d-inline">{t('pageName.tasks')}</p>{' '}
          <p className="small d-inline">{t('tasksPage.description')}</p>
        </Col>
      </Row>

      <Row>
        <Col className="p-2">
          <TableShowOptions onApply={onApply} />
        </Col>
      </Row>

      <InfiniteScroll
        pageStart={-1}
        loadMore={(page) => {
          fetchTasks({ offset: page * 5, number: 5, sortBy });
        }}
        hasMore={hasMoreTasks}
        loader={<Loading variant="loading" />}
      >
        <TaskList tasks={tasks} />
      </InfiniteScroll>
    </>
  );
};

export default TasksPage;
