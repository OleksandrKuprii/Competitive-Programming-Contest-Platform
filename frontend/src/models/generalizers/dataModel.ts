import {
  action, Action, computed, Computed, TargetResolver, thunk, Thunk, ThunkOn, thunkOn,
} from 'easy-peasy';
import loadingModel, { LoadingModel } from './loadingModel';
import updateObjectWithProperty from '../../utils/updateObjectWithProperty';
import Injections from '../../injections';
import {StoreModel} from "../store";

export type DataItemIdentifier = string;
export type DataItemRangeIdentifier = { offset: number, number: number };

interface StringIndexSignature {
  [key: string]: any
}

export interface ObjectWithId extends StringIndexSignature {
  id: DataItemIdentifier;
}

export interface DataModel<DataItem extends ObjectWithId> {
  loading: LoadingModel,

  items: Array<DataItem>,

  updated: Action<DataModel<DataItem>, DataItem>,

  fetchOne: Thunk<DataModel<DataItem>, DataItemIdentifier, Injections>,
  fetchRange: Thunk<DataModel<DataItem>, DataItemRangeIdentifier, Injections>,

  onFetchedOne: ThunkOn<DataModel<DataItem>>,
  onFetchedRange: ThunkOn<DataModel<DataItem>>,

  onChangedOne: ThunkOn<DataModel<DataItem>, Injections, StoreModel>,
  onChangedMany: ThunkOn<DataModel<DataItem>, Injections, StoreModel>,

  byId: Computed<DataModel<DataItem>, (id: DataItemIdentifier) => DataItem | undefined>,
}

export interface DataFetcherArgs {
  token?: string,
}

export interface DataModelFactoryArgs {
  dataItemFetcher: (id: DataItemIdentifier,
    args: DataFetcherArgs) => Promise<{ item: ObjectWithId }>,
  dataRangeFetcher: (range: DataItemRangeIdentifier,
    args: DataFetcherArgs) => Promise<Array<{ item: ObjectWithId }>>,

  onChangedOneTargets: TargetResolver<DataModel<ObjectWithId>, StoreModel>,
  onChangedManyTargets: TargetResolver<DataModel<ObjectWithId>, StoreModel>,

  dataModelIdentifier: string,
}

const dataModel: <T extends ObjectWithId>(args: DataModelFactoryArgs) => DataModel<T> = ({
  dataItemFetcher, dataRangeFetcher,
  onChangedOneTargets, onChangedManyTargets,
  dataModelIdentifier,
}) => ({
  loading: loadingModel(),

  items: [],

  updated: action((state, item) => {
    updateObjectWithProperty(state.items, 'id', item.id, item);
  }),

  fetchOne: thunk(async (actions, id, { injections }) => {
    actions.loading.loading();

    let token;

    try {
      token = await injections.auth0.getTokenSilently();
    } catch {}

    const item = await dataItemFetcher(id, {
      token,
    });

    actions.loading.loaded();

    return item;
  }),

  fetchRange: thunk(async (actions, range, { injections }) => {
    actions.loading.loading();

    let token;

    try {
      token = await injections.auth0.getTokenSilently();
    } catch {}

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
        return;
      }

      actions.updated(target.result.item);
    },
  ),

  onFetchedRange: thunkOn(
    (actions) => actions.fetchRange,
    (actions, target) => {
      if (!target.result) {
        return;
      }

      target.result.forEach((item: any) => {
        actions.updated(item.item);
      });
    },
  ),

  onChangedOne: thunkOn(onChangedOneTargets, (actions, target) => {
    if (target.result[dataModelIdentifier]) {
      actions.updated(target.result[dataModelIdentifier]);
    }
  }),

  onChangedMany: thunkOn(onChangedManyTargets, (actions, target) => {
    target.result.forEach((item: any) => {
      if (item[dataModelIdentifier]) {
        actions.updated(item[dataModelIdentifier]);
      }
    });
  }),

  byId: computed((state) => (id) => (
    state.items.find((item) => item.id === id))),
});

export default dataModel;
