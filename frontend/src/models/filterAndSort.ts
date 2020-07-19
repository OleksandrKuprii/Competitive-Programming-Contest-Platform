import {action, computed} from 'easy-peasy';
import {FilterAndSortModel, Result, SortBy} from '~/typings/models';
import shallowEqual from "shallowequal";

const defaultFilters = {
  difficultyRange: [1, 10],
  categories: [],
  results: [],
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

  selectedSortBy: action((state, {sortBy, order}) => {
    state.sortBy = sortBy;
    state.order = order;
  }),

  filtersApplied: computed((state) => (
    !shallowEqual(state.difficultyRange, defaultFilters.difficultyRange) ||
    !shallowEqual(state.categories, defaultFilters.categories) ||
    !shallowEqual(state.results, defaultFilters.results)
  ))
};

export default filterAndSortModel;
