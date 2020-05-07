import * as React from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { FaFileUpload } from 'react-icons/fa';

export interface SolutionDropZoneProps {
  children: ReactNode;
  fileUploaded: boolean;
  onDropAccepted: (file: File) => any;
}

const SolutionDropZone = ({
  children,
  fileUploaded,
  onDropAccepted,
}: SolutionDropZoneProps) => {
  const { t } = useTranslation();

  return (
    <Dropzone
      multiple={false}
      disabled={fileUploaded}
      onDropAccepted={(files) => {
        onDropAccepted(files[0]);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {/* eslint-enable react/jsx-props-no-spreading */}

            {fileUploaded ? (
              children
            ) : (
              <div className="badge-secondary p-5">
                <div className="display-2 text-center">
                  <FaFileUpload />
                </div>
                <p
                  className="text-center big p-2"
                  style={{ cursor: 'default' }}
                >
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

export default SolutionDropZone;
