import * as React from 'react';
import { FC, ReactNode, useCallback } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaFileUpload } from 'react-icons/fa';
import { Text, TextAlign } from '@/toucanui/atoms/typography';
import Box from '@/toucanui/atoms/box';
import { useStoreState, useStoreActions } from '~/hooks/store';

export interface SolutionDropZoneProps {
  children: ReactNode;
}

const SolutionDropZone: FC<SolutionDropZoneProps> = ({ children }) => {
  const { t } = useTranslation();

  const fileUploaded = useStoreState(
    (state) => state.solutionSubmission.fileUploaded,
  );
  const uploadFile = useStoreActions(
    (actions) => actions.solutionSubmission.uploadFile,
  );

  const onDropAccepted = useCallback(
    async (files: File[]) => {
      await uploadFile(files[0]);

      document.body.scrollIntoView(false);
    },
    [uploadFile],
  );

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

            {fileUploaded ? (
              children
            ) : (
              <Box padding={100}>
                <Text style={{ cursor: 'default' }} align={TextAlign.Center}>
                  {t('taskPage.dropFileHere')}
                </Text>
              </Box>
            )}
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default SolutionDropZone;
