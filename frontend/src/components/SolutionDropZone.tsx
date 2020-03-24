import * as React from 'react';
import Dropzone from 'react-dropzone';
import { Jumbotron, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';

const SolutionDropZone = ({ onSubmit }: { onSubmit: any }) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const updatedFile = useStoreActions((actions: any) => actions.submission.file.updatedFile);
  const canceled = useStoreActions((actions: any) => actions.submission.file.canceled);
  const file = useStoreState((state: any) => state.submission.file.file);

  return (
    <Dropzone
      multiple={false}
      disabled={file !== null}
      onDropAccepted={(files) => { setDragEntered(false); updatedFile(files[0]); }}
      onDragEnter={() => setDragEntered(true)}
      onDragLeave={() => setDragEntered(false)}
      onDropRejected={() => setDragEntered(false)}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {/* eslint-enable react/jsx-props-no-spreading */}

            <Jumbotron style={dragEntered ? {
              backgroundColor: '#79808c', color: 'white', fontWeight: 'bold', borderColor: '#57606a', borderWidth: 10, borderStyle: 'solid',
            } : undefined}
            >
              {file === null ? t('taskpage.dropfilehere')
                : (
                  <>
                    <p className="h3">{file.name}</p>

                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="primary"
                        onClick={() => { onSubmit(); updatedFile(null); }}
                      >
                        OK
                      </Button>
                      <Button variant="secondary" onClick={canceled}>Cancel</Button>
                    </ButtonGroup>
                  </>
                )}
            </Jumbotron>
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default SolutionDropZone;
