import { action, computed, persist, thunk, thunkOn } from 'easy-peasy';
import shallowEqual from 'shallowequal';
import loadingModel from './loadingModel';
import updateObjectWithProperty from '../../utils/updateObjectWithProperty';
import { DataModel, DataModelFactoryArgs, DataModelItem } from '../interfaces';

const dataModel: <Identifier, Item extends DataModelItem<Identifier>>(
  args: DataModelFactoryArgs<Identifier, Item>,
) => DataModel<Identifier, Item> = ({
  dataItemFetcher,
  dataRangeFetcher,
  onChangedOneTargets,
  onChangedManyTargets,
  dataModelIdentifier,
}) =>
  persist(
    {
      loading: loadingModel(),

      items: [],

      lastFetchedRange: undefined,

      fetchedRange: action((state) => {
        state.lastFetchedRange = new Date();
      }),

      updated: action((state, item) => {
        updateObjectWithProperty(state.items, 'id', item.id, item);
      }),

      updatedMany: action((state, items) => {
        items.forEach((item) => {
          updateObjectWithProperty(state.items, 'id', item.id, item);
        });
      }),

      fetchOne: thunk(async (actions, id, { injections }) => {
        const loadingItem: any = {
          id,
          loading: true,
        };

        actions.updated(loadingItem);

        let token;

        try {
          token = await injections.auth0.getTokenSilently();
        } catch {
          token = undefined;
        }

        return dataItemFetcher(id, {
          token,
        });
      }),

      fetchRange: thunk(async (actions, range, { injections, getState }) => {
        const lastFetched = getState().lastFetchedRange;

        if (
          lastFetched !== undefined &&
          // @ts-ignore
          new Date() - new Date(lastFetched) < 30 * 1000 * 60
        ) {
          return [];
        }

        actions.loading.loading();

        let token;

        try {
          token = await injections.auth0.getTokenSilently();
        } catch {
          token = undefined;
        }

        const items = await dataRangeFetcher(range, {
          token,
        });

        actions.loading.loaded();

        return items;
      }),

      onFetchedOne: thunkOn(
        (actions) => actions.fetchOne,
        (actions, target) => {
          if (!target.result) {
            setTimeout(() => {
              actions.fetchOne(target.payload as any);
            }, 5000);

            return;
          }

          actions.updated(target.result.item);
        },
      ),

      onFetchedRange: thunkOn(
        (actions) => actions.fetchRange,
        (actions, target) => {
          if (!target.result) {
            setTimeout(() => {
              actions.fetchRange(target.payload as any);
            }, 5000);

            return;
          }

          actions.updatedMany(target.result.map((a: any) => a.item));

          actions.fetchedRange();
        },
      ),

      onChangedOne: thunkOn(onChangedOneTargets, (actions, target) => {
        if (!target.result) {
          return;
        }

        if (target.result[dataModelIdentifier]) {
          actions.updated(target.result[dataModelIdentifier]);
        }
      }),

      onChangedMany: thunkOn(onChangedManyTargets, (actions, target) => {
        if (!target.result) {
          return;
        }

        target.result.forEach((item: any) => {
          if (item[dataModelIdentifier]) {
            actions.updated(item[dataModelIdentifier]);
          }
        });
      }),

      byId: computed((state) => (id) =>
        state.items.find((item) => item.id === id),
      ),

      nItemsById: computed((state) => (number) =>
        state.items.sort((a, b) => (a.id > b.id ? -1 : 1)).slice(0, number),
      ),

      nItemsByCustomKeys: computed((state) => (keys, filters, joinWith) => {
        const aGreater = (desc?: boolean) => (desc ? -1 : 1);
        const bGreater = (desc?: boolean) => -aGreater(desc);

        const items = state.items
          .concat()
          .map((item) => ({ ...item, ...(joinWith ? joinWith(item) : {}) }))
          .sort((a, b) => {
            for (let i = 0; i < keys.length; i += 1) {
              const { key, option } = keys[i];

              const desc = option === 'desc';

              const aValue = key(a);
              const bValue = key(b);

              if (aValue !== undefined && bValue === undefined) {
                return aGreater(true);
              }

              if (aValue === undefined && bValue !== undefined) {
                return bGreater(true);
              }

              if (aValue !== undefined && bValue !== undefined) {
                if (aValue > bValue) {
                  return aGreater(desc);
                }

                if (bValue > aValue) {
                  return bGreater(desc);
                }
              }
            }

            return 0;
          });

        if (!filters) {
          return items;
        }

        return items.filter((item) =>
          filters.every(({ name, option }) => {
            if (
              typeof option === 'number' ||
              typeof option === 'boolean' ||
              typeof option === 'string'
            ) {
              return shallowEqual(item[name], option);
            }

            return item[name] >= option.from && item[name] <= option.to;
          }),
        );
      }),
    },
    { storage: 'localStorage' },
  );

export default dataModel;
