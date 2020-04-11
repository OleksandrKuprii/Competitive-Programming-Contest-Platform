import { action } from 'easy-peasy';
import { LoadingModel } from '../interfaces';

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
