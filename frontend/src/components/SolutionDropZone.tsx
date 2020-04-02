import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropzone from 'react-dropzone';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import uuid from 'react-uuid';
import { useStoreActions, useStoreState } from '../hooks/store';
import CodeViewer from './CodeViewer';

export interface SolutionDropZoneArgs {
  taskAlias: string
}

const SolutionDropZone = ({ taskAlias }: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const file = useStoreState((state) => state.taskSubmission.submission.file.file);
  const fileText = useStoreState((state) => state.taskSubmission.submission.file.fileText);
  const language = useStoreState((state) => state.taskSubmission.submission.file.language);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const idTokenClaims = useStoreState((state) => state.auth0.idTokenClaims);

  const canceled = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.canceled,
  );
  const selectedLanguage = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.selectedLanguage,
  );
  const updatedFile = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.updatedFile,
  );
  const uploadFile = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.uploadFile,
  );
  const submitSubmission = useStoreActions(
    (actions) => actions.taskSubmission.submission.submitSubmission,
  );

  const submitSolutionCallback = useCallback(() => {
    if (!language || !taskAlias || !idTokenClaims || !fileText) {
      return;
    }

    submitSubmission({
      language,
      taskAlias,
      // eslint-disable-next-line
      token: idTokenClaims.__raw,
      code: fileText,
    });

    updatedFile({ file: null, fileText: null });
  }, [submitSubmission, language, idTokenClaims, fileText, taskAlias, updatedFile]);

  const languages = ['python3', 'python2', 'c++', 'c'];

  if (language === null) {
    selectedLanguage(languages[0]);
  }

  return (
    <Dropzone
      multiple={false}
      disabled={file !== null}
      onDropAccepted={async (files) => {
        setDragEntered(false);
        await uploadFile(files[0]);
      }}
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

            <div className={dragEntered ? 'drop-zone drop-zone-drag-on' : 'drop-zone'}>
              {file === null ? t('taskPage.dropFileHere')
                : (
                  <Row>
                    <Col>
                      <p className="h4">{file.name}</p>

                      <FormControl
                        as="select"
                        onChange={
                          (e) => selectedLanguage((e.target as HTMLSelectElement).value)
                        }
                        value={language || ''}
                      >
                        {languages.map((element) => (
                          <option key={uuid()}>{element}</option>
                        ))}
                      </FormControl>

                      <hr />

                      {isAuthenticated
                        ? (
                          <ButtonGroup>
                            <Button variant="success" onClick={() => submitSolutionCallback()}>Submit</Button>
                            <Button variant="danger" onClick={() => canceled()}>Cancel</Button>
                          </ButtonGroup>
                        )
                        : (
                          <>
                            <p className="h5">Please login to submit solution</p>
                          </>
                        )}
                    </Col>
                    <Col>
                      <CodeViewer code={fileText || ''} language="python" />
                    </Col>
                  </Row>
                )}
            </div>
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default SolutionDropZone;
