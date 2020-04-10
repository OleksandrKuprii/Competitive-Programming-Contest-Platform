import {
  thunkOn, ThunkOn,
} from 'easy-peasy';
import dataModel, { DataModel, ObjectWithId } from './generalizers/dataModel';

export interface Category extends ObjectWithId {
  name?: string,
}

export interface CategoryModel extends DataModel<Category> {}

const categoryModel: CategoryModel = {
  ...dataModel<Category>({
    dataItemFetcher: async (id) => ({ item: { id } }),
    dataRangeFetcher: async () => [],

    onChangedManyTargets: (state, storeActions) => [
      storeActions.task.fetchRange,
    ],
    onChangedOneTargets: (state, storeActions) => [],

    dataModelIdentifier: 'category',
  }),
};

export default categoryModel;
