import * as React from 'react';
import Dropzone from 'react-dropzone';
import {
  ButtonGroup, Button, Form, Col, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import uuid from 'react-uuid';
import { useHistory } from 'react-router-dom';
import CodeViewer from './CodeViewer';

export interface SolutionDropZoneArgs {
  taskAlias: string
}

const SolutionDropZone = ({taskAlias}: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const uploadFile = useStoreActions((actions: any) => actions.submission.file.uploadFile);
  const updatedFile = useStoreActions((actions: any) => actions.submission.file.updatedFile);

  const canceled = useStoreActions((actions: any) => actions.submission.file.canceled);
  const file = useStoreState((state: any) => state.submission.file.file);
  const fileText = useStoreState((state: any) => state.submission.file.fileText);

  const language = useStoreState(
    (state: any) => state.submission.file.language,
  );
  const selectedLanguage = useStoreActions(
    (actions: any) => actions.submission.file.selectedLanguage,
  );
  const languages = ['python3', 'python2', 'c++', 'c'];

  const history = useHistory();

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

            <div className={dragEntered ? 'dropzone dropzone-dragon' : 'dropzone'}>
              {file === null ? t('taskpage.dropfilehere')
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
                          <Form.Control as="select" value={language} onChange={(event: any) => selectedLanguage(event.target.value)}>
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
                            onClick={() => {
                              updatedFile({ file: null, fileText: null });
                            }}
                            type="submit"
                          >
                            OK
                          </Button>
                          <Button variant="secondary" onClick={canceled}>Cancel</Button>
                        </ButtonGroup>
                      </Form.Row>
                      <div style={{ paddingTop: 20 }} />
                      <Form.Row>
                        <Container fluid style={{ padding: 0 }}>
                          <CodeViewer code={fileText} language={language} />
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
