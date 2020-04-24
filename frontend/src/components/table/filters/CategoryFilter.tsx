import * as React from 'react';
import { useStoreState, useStoreActions } from '../../../hooks/store';
import SelectableFilter from './SelectableFilter';

const CategoryFilter = () => {
  const categories = useStoreState((state) =>
    state.category.nItemsByCustomKeys([
      { key: (item) => item.name, option: 'asc' },
    ]),
  );

  const selected = useStoreState(
    (state) =>
      state.filter.options.find(
        (o) => o.tableName === 'task' && o.name === 'category',
      )?.option as string,
  );

  const category = categories.find((c) => c.id === selected);

  const changedOption = useStoreActions((state) => state.filter.changedOption);
  const deletedOption = useStoreActions((state) => state.filter.deletedOption);

  return (
    <SelectableFilter
      header="category"
      value={category?.name || ''}
      onChange={(e) => {
        const { value } = e.target as HTMLInputElement;

        if (value === 'All') {
          deletedOption({
            tableName: 'task',
            name: 'category',
          });
        } else {
          const newCategory = categories.find((c) => c.name === value);

          if (newCategory !== undefined) {
            changedOption({
              tableName: 'task',
              name: 'category',
              value: newCategory.id,
            });
          }
        }
      }}
    >
      <>
        <option>All</option>
        {categories.map((c) => (
          <option key={c.id}>{c.name}</option>
        ))}
      </>
    </SelectableFilter>
  );
};

export default CategoryFilter;
