import { action, computed } from 'easy-peasy';
import { AscDescOrNone, SortModel } from './interfaces';

const sortModel: SortModel = {
  options: [],

  toggleOption: action((state, { tableName, option, header }) => {
    const item = state.options.find(
      (o) => o.tableName === tableName && o.name === header,
    );

    if (item) {
      if (item.option === option) {
        state.options = state.options.filter(
          (o) =>
            !(
              o.tableName === tableName &&
              o.name === header &&
              o.option === option
            ),
        );
        return;
      }

      state.options = state.options.map((o) =>
        o.tableName === tableName && o.name === header
          ? { tableName, name: header, option }
          : o,
      );
      return;
    }

    state.options = state.options.concat([{ tableName, name: header, option }]);
  }),

  getOption: computed((state) => (tableName, header) =>
    state.options.find((o) => o.tableName === tableName && o.name === header)
      ?.option as AscDescOrNone,
  ),

  getKeys: computed((state) => (tableName, defaultOption) => {
    const options = state.options
      .filter((o) => o.tableName === tableName)
      .map((o) => ({ ...o, key: o.name }));

    return (
      options
        .map((o) => o.key)
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
