import { action } from 'easy-peasy';
import {FilterAndSortModel, Result, SortBy} from '~/typings/models';

const defaultFilters = {
  difficultyRange: [1, 10],
  categories: [],
  results: [ Result.Correct, Result.Partial, Result.Zero, Result.NotStarted ],
}

const filterAndSortModel: FilterAndSortModel = {
  ...defaultFilters,

  sortBy: SortBy.publishedAt,
  order: -1,

  selectedDifficultyRange: action((state, difficultyRange) => {
    state.difficultyRange = difficultyRange;
  }),

  selectedCategories: action((state, categories) => {
    state.categories = categories;
  }),

  toggledResult: action((state, result) => {
    if (state.results.includes(result)) {
      state.results = state.results.filter(r => r !== result);
      return;
    }

    state.results.push(result);
  }),

  clearedFilters: action(state => {
    state.difficultyRange = [...defaultFilters.difficultyRange];
    state.categories = [...defaultFilters.categories];
    state.results = [...defaultFilters.results];
  }),

  selectedSortBy: action((state, { sortBy, order }) => {
    state.sortBy = sortBy;
    state.order = order;
  }),
};

export default filterAndSortModel;
