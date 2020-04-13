import * as React from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { ReactNode, useCallback } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import { useStoreActions, useStoreState } from '../../hooks/store';

export interface SolutionDropZoneArgs {
  children: ReactNode,
}

const TaskSolutionDropZone = ({ children }: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const fileUploaded = useStoreState((state) => state.solutionSubmission.fileUploaded);
  const uploadFile = useStoreActions((state) => state.solutionSubmission.uploadFile);

  const onDropAccepted = useCallback(async (files) => {
    await uploadFile(files[0]);
    window.scrollTo(0, document.body.scrollHeight);
  }, [uploadFile]);

  return (
    <Dropzone
      multiple={false}
      disabled={fileUploaded}
      onDropAccepted={onDropAccepted}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {/* eslint-enable react/jsx-props-no-spreading */}

            {fileUploaded
              ? children
              : (
                <div className="badge-secondary p-5">
                  <div className="display-2 text-center">
                    <FaFileUpload />
                  </div>
                  <p className="text-center big p-2">
                    {t('taskPage.dropFileHere')}
                  </p>
                </div>
              )}
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default TaskSolutionDropZone;
