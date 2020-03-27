import {
  action, thunk, Action, Thunk,
} from 'easy-peasy';


export interface SubmissionFileModel {
  file: File | null,
  fileText: string | null,
  language: string | null,
  selectedLanguage: Action<SubmissionFileModel, string>,
  uploadFile: Thunk<SubmissionFileModel, File>,
  updatedFile: Action<SubmissionFileModel, { file: File | null, fileText: string | null }>,
  canceled: Action<SubmissionFileModel>
}


const submissionFileModel: SubmissionFileModel = {
  file: null,
  fileText: '',
  language: null,

  selectedLanguage: action((state, language) => ({
    ...state,
    language,
  })),

  uploadFile: thunk(async (actions, file) => {
    const fileText = await file.text();

    actions.updatedFile({ file, fileText });
  }),

  updatedFile: action((state, payload) => ({
    ...state,
    file: payload.file,
    fileText: payload.fileText,
  })),

  canceled: action((state) => ({
    ...state,
    file: null,
    fileText: null,
  })),
};

export default submissionFileModel;
