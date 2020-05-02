import * as React from 'react';
import shallowEqual from 'shallowequal';
import { useCallback } from 'react';
import { useStoreState, useStoreActions } from '../../hooks/store';

const CategoryName = ({ id }: { id: string | undefined }) => {
  const name = useStoreState(
    (state) => (id ? state.category.byId(id) : undefined)?.name,
    shallowEqual,
  );

  const changedOptions = useStoreActions(
    (state) => state.filter.changedOptions,
  );

  const onClick = useCallback(() => {
    if (id !== undefined) {
      changedOptions([
        {
          tableName: 'task',
          name: 'category',
          value: id,
        },
      ]);
    }
  }, [changedOptions, id]);

  if (name) {
    return (
      <div
        onClick={onClick}
        onKeyDown={onClick}
        aria-hidden="true"
        className="btn-link"
        style={{ cursor: 'pointer' }}
      >
        {name}
      </div>
    );
  }

  return <></>;
};

export default React.memo(CategoryName);
