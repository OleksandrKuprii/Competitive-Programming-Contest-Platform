import { action, computed, thunk, thunkOn } from 'easy-peasy';
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
}) => ({
  loading: loadingModel(),

  items: [],

  updated: action((state, item) => {
    updateObjectWithProperty(state.items, 'id', item.id, item);
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

  fetchRange: thunk(async (actions, range, { injections }) => {
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

      target.result.forEach((item: any) => {
        actions.updated(item.item);
      });
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

  byId: computed((state) => (id) => state.items.find((item) => item.id === id)),

  nItemsById: computed((state) => (number) =>
    state.items.sort((a, b) => (a.id > b.id ? -1 : 1)).slice(0, number),
  ),

  nItemsByCustomKey: computed((state) => (key, desc) => {
    const aGreater = desc ? -1 : 1;
    const bGreater = -aGreater;

    return (
      state.items
        .filter((item) => key(item) !== undefined)
        // @ts-ignore
        .sort((a, b) => (key(a) > key(b) ? aGreater : bGreater))
    );
  }),
});

export default dataModel;
