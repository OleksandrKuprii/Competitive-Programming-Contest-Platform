import { action } from 'easy-peasy';
import { FilterAndSortModel, SortBy } from '~/typings/models';

const filterAndSortModel: FilterAndSortModel = {
  difficultyRange: [1, 10],
  categories: [],
  results: [],

  sortBy: SortBy.publishedAt,
  order: -1,

  selectedDifficultyRange: action((state, difficultyRange) => {
    state.difficultyRange = difficultyRange;
  }),

  selectedCategories: action((state, categories) => {
    state.categories = categories;
  }),

  selectedResults: action((state, results) => {
    state.results = results;
  }),

  selectedSortBy: action((state, { sortBy, order }) => {
    state.sortBy = sortBy;
    state.order = order;
  }),
};

export default filterAndSortModel;
