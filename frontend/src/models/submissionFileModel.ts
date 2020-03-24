import { action } from 'easy-peasy';


const submissionFileModel = {
  file: null,

  updatedFile: action((state: any, payload) => ({
    ...state,
    file: payload,
  })),

  canceled: action((state: any) => ({
    ...state,
    file: null,
  })),
};

export default submissionFileModel;
