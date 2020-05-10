import * as React from 'react';
import { ReactNode } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaFileUpload } from 'react-icons/fa';
import { BigTitle, Paragraph } from '@/atoms/typography';
import Box from '@/atoms/box';

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
              <Box padding={100}>
                <BigTitle align="center">
                  <FaFileUpload />
                </BigTitle>

                <Paragraph style={{ cursor: 'default' }} align="center">
                  {t('taskPage.dropFileHere')}
                </Paragraph>
              </Box>
            )}
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default SolutionDropZone;
