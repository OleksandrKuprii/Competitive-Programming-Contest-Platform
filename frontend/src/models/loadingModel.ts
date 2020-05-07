import { action } from 'easy-peasy';
import { LoadingModel } from './interfaces';

const loadingModel: () => LoadingModel = () => ({
  loadingStatus: false,

  loading: action((state) => {
    state.loadingStatus = true;
  }),

  loaded: action((state) => {
    state.loadingStatus = false;
  }),
});

export default loadingModel;
