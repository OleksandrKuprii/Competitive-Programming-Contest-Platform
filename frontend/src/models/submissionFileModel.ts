import { action } from 'easy-peasy';


const submissionFileModel = {
  file: null,

  updateFile: action((state: any, payload) => ({
    ...state,
    file: payload,
  })),

  cancel: action((state: any) => ({
    ...state,
    file: null,
  })),
};

export default submissionFileModel;
