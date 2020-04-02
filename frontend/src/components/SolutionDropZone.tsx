import * as React from 'react';
import Dropzone from 'react-dropzone';
import {
  ButtonGroup, Button, Form, Col, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import uuid from 'react-uuid';
import { useStoreActions, useStoreState } from '../hooks/store';
import CodeViewer from './CodeViewer';

export interface SolutionDropZoneArgs {
  taskAlias: string
}

const SolutionDropZone = ({ taskAlias }: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const uploadFile = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.uploadFile,
  );
  const updatedFile = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.updatedFile,
  );

  const canceled = useStoreActions((actions) => actions.taskSubmission.submission.file.canceled);
  const file = useStoreState((state) => state.taskSubmission.submission.file.file);
  const fileText = useStoreState((state) => state.taskSubmission.submission.file.fileText);

  const submitSubmission = useStoreActions(
    (actions) => actions.taskSubmission.submission.submitSubmission,
  );

  const language = useStoreState(
    (state) => state.taskSubmission.submission.file.language,
  );
  const selectedLanguage = useStoreActions(
    (actions) => actions.taskSubmission.submission.file.selectedLanguage,
  );
  const languages = ['python3', 'python2', 'c++', 'c'];

  if (language === null) {
    selectedLanguage(languages[0]);
  }

  return (
    <Dropzone
      multiple={false}
      disabled={file !== null}
      onDropAccepted={async (files) => { setDragEntered(false); await uploadFile(files[0]); }}
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
                  <>
                    <Form>
                      <Form.Row>
                        <Form.Group as={Col}>
                          <Form.Row>
                            <span className="h3">
                              {file.name}
                            </span>
                          </Form.Row>
                          <Form.Row>
                            <span className="subtitle">
                              {file.type}
                            </span>
                          </Form.Row>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Language</Form.Label>
                          <Form.Control as="select" value={language === null ? languages[0] : language} onChange={(event: any) => selectedLanguage(event.target.value)}>
                            {languages.map((lang) => (
                              <option key={uuid()}>{lang}</option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            onClick={async () => {
                              await submitSubmission({ taskAlias, language: 'python3', code: fileText || '' });
                              updatedFile({ file: null, fileText: null });
                            }}
                            type="submit"
                          >
                            OK
                          </Button>
                          <Button variant="secondary" onClick={() => canceled()}>Cancel</Button>
                        </ButtonGroup>
                      </Form.Row>
                      <div style={{ paddingTop: 20 }} />
                      <Form.Row>
                        <Container fluid style={{ padding: 0 }}>
                          <CodeViewer
                            code={fileText === null ? '' : fileText}
                            language={language === null ? '' : language}
                          />
                        </Container>
                      </Form.Row>
                    </Form>
                  </>
                )}
            </div>
          </div>
        </>
      )}
    </Dropzone>
  );
};

export default SolutionDropZone;
