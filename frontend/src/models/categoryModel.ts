import dataModel from './generalizers/dataModel';
import { Category, CategoryModel } from './interfaces';

const categoryModel: CategoryModel = {
  ...dataModel<String, Category>({
    dataItemFetcher: async (id) => ({ item: { id, loading: false } }),
    dataRangeFetcher: async () => [],

    onChangedManyTargets: (state, storeActions) => [storeActions.task.fetchRange],
    onChangedOneTargets: () => [],

    dataModelIdentifier: 'category',
  }),
};

export default categoryModel;
