import {
  action, thunk, Action, Thunk,
} from 'easy-peasy';


export interface SubmissionFileModel {
  file?: File,
  fileText?: string,
  language?: string,
  selectedLanguage: Action<SubmissionFileModel, string>,
  uploadFile: Thunk<SubmissionFileModel, File>,
  updatedFile: Action<SubmissionFileModel, { file?: File, fileText?: string }>,
  canceled: Action<SubmissionFileModel>
}


const submissionFileModel: SubmissionFileModel = {
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
    file: undefined,
    fileText: undefined,
  })),
};

export default submissionFileModel;
