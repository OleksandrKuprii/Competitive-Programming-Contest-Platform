import { action, Action } from 'easy-peasy';

export interface LoadingModel {
  loading: boolean,
  changedLoadingStatus: Action<LoadingModel, boolean>,
}

const loadingModel: () => LoadingModel = () => ({
  loading: false,
  changedLoadingStatus: action((state, loading) => ({
    loading,
  })),
});

export default loadingModel;
