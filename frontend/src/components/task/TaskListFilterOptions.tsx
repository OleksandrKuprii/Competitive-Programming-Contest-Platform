import * as React from 'react';
import Col from 'react-bootstrap/Col';
import shallowEqual from 'shallowequal';
import CategoryFilter from '../table/filters/CategoryFilter';
import IntRangeFilter from '../table/filters/IntRangeFilter';
import CheckboxFilter from '../table/filters/CheckboxFilter';
import { useStoreActions, useStoreState } from '../../hooks/store';

const checkboxes = ['correct', 'partial', 'zero', 'notStarted'];

const checkboxHeaders = [
  'showSolved',
  'showPartiallySolved',
  'showZeroSolved',
  'showNotStarted',
].map((x) => ({
  header: x,
}));

const TaskListFilterOptions = () => {
  const changedOptions = useStoreActions(
    (actions) => actions.filter.changedOptions,
  );

  const difficulty = useStoreState(
    (state) => state.filter.getOption('task', 'difficulty'),
    shallowEqual,
  ) as { from: number; to: number };

  const checkboxValues = useStoreState(
    (state) => checkboxes.map((x) => state.filter.getOption('task', x)),
    shallowEqual,
  ) as boolean[];

  return (
    <>
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
            changedOptions([
              {
                tableName: 'task',
                name: 'difficulty',
                value: {
                  from: values[0],
                  to: values[1],
                },
              },
            ]);
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

            changedOptions(
              names.map((name, i) => {
                const value = values[i];

                return {
                  tableName: 'task',
                  name,
                  value: false,
                  remove: value,
                };
              }),
            );
          }}
          checked={checkboxValues.map((value) => {
            if (value === undefined) {
              return true;
            }

            return value;
          })}
          options={checkboxHeaders}
        />
      </Col>
    </>
  );
};

export default TaskListFilterOptions;
