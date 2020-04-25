import { action, computed } from 'easy-peasy';
import { FilterModel } from './interfaces';

const filterModel: FilterModel = {
  options: [],

  changedOptions: action((state, options) => {
    options.forEach(({ tableName, name, value, remove }) => {
      if (remove) {
        state.options = state.options.filter(
          (o) => !(o.tableName === tableName && o.name === name),
        );

        return;
      }

      const item = state.options.find(
        (o) => o.tableName === tableName && o.name === name,
      );

      if (item) {
        state.options = state.options.map((o) =>
          o.tableName === tableName && o.name === name
            ? { tableName, name, option: value }
            : o,
        );
        return;
      }

      state.options.push({ tableName, name, option: value });
    });
  }),

  deletedOption: action((state, { tableName, name }) => {
    state.options = state.options.filter(
      (o) => !(o.tableName === tableName && o.name === name),
    );
  }),

  getOption: computed((state) => (tableName, name) => {
    return state.options.find(
      (o) => o.tableName === tableName && o.name === name,
    )?.option;
  }),

  getOptions: computed((state) => (tableName) => {
    return state.options
      .filter((option) => {
        return option.tableName === tableName;
      })
      .map(({ option, name }) => {
        return { option, name };
      });
  }),
};

export default filterModel;
