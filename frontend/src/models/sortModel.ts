import { action, computed } from 'easy-peasy';
import { AscDescOrNone, SortModel } from './interfaces';
import updateObjectWithProperty from '../utils/updateObjectWithProperty';

const sortModel: SortModel = {
  options: [],

  toggleOption: action((state, { tableName, option, header }) => {
    const key = `${tableName}.${header}`;

    const item = state.options.find((o) => o.key === key);

    if (item) {
      if (item.option === option) {
        // eslint-disable-next-line no-param-reassign
        state.options = state.options.filter((i) => i.key !== key);
        return;
      }
    }

    updateObjectWithProperty(state.options, 'key', key, { key, option });
  }),

  getOption: computed((state) => (tableName, header) =>
    state.options.find((o) => o.key === `${tableName}.${header}`)
      ?.option as AscDescOrNone,
  ),

  getKeys: computed((state) => (tableName, sortOptions, defaultOption) => {
    const options = state.options
      .filter((o) => o.key.split('.')[0] === tableName)
      .map((o) => ({ ...o, key: o.key.split('.')[1] }));

    return (
      options
        .map((o) => o.key)
        .filter((k) => sortOptions.includes(k))
        .map((key) => {
          return {
            key: (item: any) => item[key],
            option: options.find((o) => o.key === key)?.option,
          };
        })
        .filter((i) => i.option !== undefined) || [
        {
          key: (item) => item[defaultOption.key],
          option: defaultOption.option,
        },
      ]
    );
  }),
};

export default sortModel;
