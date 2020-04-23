import { action } from 'easy-peasy';
import { LoadingModel } from '../interfaces';

const loadingModel: () => LoadingModel = () => ({
  flag: false,

  hasMore: true,

  loading: action(() => ({
    flag: true,
    hasMore: false,
  })),

  loaded: action((state, hasMore) => ({
    flag: false,
    hasMore,
  })),
});

export default loadingModel;
