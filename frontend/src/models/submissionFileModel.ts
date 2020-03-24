import { action, thunk } from 'easy-peasy';


const submissionFileModel = {
  file: null,
  fileText: '',
  language: null,

  selectedLanguage: action((state: any, payload: string) => ({
    ...state,
    language: payload,
  })),

  uploadFile: thunk(async (actions: any, file: File) => {
    const fileText = await file.text();

    actions.updatedFile({ file, fileText });
  }),

  updatedFile: action((state: any, payload) => ({
    ...state,
    file: payload.file,
    fileText: payload.fileText,
  })),

  canceled: action((state: any) => ({
    ...state,
    file: null,
    fileText: null,
  })),
};

export default submissionFileModel;
