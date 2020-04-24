import { action } from 'easy-peasy';
import { LoadingModel } from '../interfaces';

const loadingModel: () => LoadingModel = () => ({
  flag: false,

  loading: action((state) => {
    state.flag = true;
  }),

  loaded: action((state) => {
    state.flag = false;
  }),
});

export default loadingModel;
