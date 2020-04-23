import { action, computed } from 'easy-peasy';
import { FilterModel, FilterOption } from './interfaces';

const filterModel: FilterModel = {
  options: new Map(),

  changedOption: action((state, { tableName, name, value }) => {
    state.options.set(`${tableName}.${name}`, value);
  }),

  deletedOption: action((state, { tableName, name }) => {
    state.options.delete(`${tableName}.${name}`);
  }),

  getOptions: computed((state) => (tableName) => {
    return Array.from(state.options as Map<string, FilterOption>)
      .filter(([key]) => {
        return key.split('.')[0] === tableName;
      })

      .map(([key, option]) => {
        return { option, name: key.split('.')[1] };
      });
  }),
};

export default filterModel;
