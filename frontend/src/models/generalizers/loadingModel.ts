import { action, Action } from 'easy-peasy';

export interface LoadingModel {
  flag: boolean,
  loading: Action<LoadingModel>,
  loaded: Action<LoadingModel>,
}

const loadingModel: () => LoadingModel = () => ({
  flag: false,

  loading: action(() => ({
    flag: true,
  })),

  loaded: action(() => ({
    flag: false,
  })),
});

export default loadingModel;
