import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import { useStoreState } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import CategoryFilter from '../components/table/filters/CategoryFilter';
import IntRangeFilter from '../components/table/filters/IntRangeFilter';

const TasksPage = () => {
  const { t } = useTranslation();

  const sortOptions = ['name', 'category', 'difficulty', 'result'];

  const getKeys = useStoreState((store) => store.sort.getKeys);

  const keys = getKeys('task', sortOptions, {
    key: 'publishedAt',
    option: 'desc',
  });

  const tasks = useStoreState(
    (state) => state.task.nItemsByCustomKeys(keys),
    shallowEqual,
  );

  return (
    <>
      <Row>
        <Col>
          <p className="h3 m-0 d-inline">{t('pageName.tasks')}</p>{' '}
        </Col>
      </Row>

      <div style={{ padding: '10px 0' }} />

      <Row>
        <Col md="auto">
          <CategoryFilter />
        </Col>
        <Col md="auto">
          <IntRangeFilter header="Difficulty" from={0} to={10} />
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
