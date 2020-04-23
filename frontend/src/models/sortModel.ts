import { action, computed } from 'easy-peasy';
import { SortModel } from './interfaces';

const sortModel = {
  options: new Map(),

  toggleOption: action((state, { tableName, header, option }) => {
    const key = `${tableName}.${header}`;

    if (state.options.has(key)) {
      if (state.options.get(key) === option) {
        state.options.delete(key);
        return;
      }
    }

    state.options.set(key, option);
  }),

  getOption: computed((state) => (tableName, header) =>
    state.options.get(`${tableName}.${header}`),
  ),
} as SortModel;

export default sortModel;
