import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropzone from 'react-dropzone';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useStoreActions, useStoreState } from '../../hooks/store';
import SubmissionCodeViewer from '../submission/SubmissionCodeViewer';
import getGeneralLanguageName from '../../utils/getGeneralLanguageName';

export interface SolutionDropZoneArgs {
  taskAlias: string
}

const TaskSolutionDropZone = ({ taskAlias }: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const file = useStoreState((state) => state.taskSubmission.submission.file.file);
  const fileText = useStoreState((state) => state.taskSubmission.submission.file.fileText);
  const language = useStoreState((state) => state.taskSubmission.submission.file.language);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);

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

  const languages = ['python3', 'python2', 'c++', 'c'];

  const submitSolutionCallback = useCallback(async () => {
    if (!taskAlias || !token || !fileText) {
      return;
    }

    updatedFile({ file: undefined, fileText: undefined });

    await submitSubmission({
      language: language || languages[0],
      taskAlias,
      token,
      code: fileText,
    });
  },
  [submitSubmission,
    languages,
    language,
    token,
    fileText,
    taskAlias,
    updatedFile]);

  return (
    <Dropzone
      multiple={false}
      disabled={file !== undefined}
      onDropAccepted={async (files) => {
        setDragEntered(false);
        await uploadFile(files[0]);
        window.scrollTo(0, document.body.scrollHeight);
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
              {file === undefined ? t('taskPage.dropFileHere')
                : (
                  <Row>
                    <Col>
                      <p className="h4 text-center">{file?.name}</p>

                      <FormControl
                        as="select"
                        onChange={
                          (e) => selectedLanguage((e.target as HTMLSelectElement).value)
                        }
                        value={language || ''}
                      >
                        {languages.map((element) => (
                          <option key={`language-${element}-option`}>
                            {element}
                          </option>
                        ))}
                      </FormControl>

                      <hr />

                      {isAuthenticated
                        ? null
                        : (
                          <>
                            <p className="description">Please login to submit solution</p>
                          </>
                        )}
                      <ButtonGroup>
                        <Button variant="primary" disabled={!isAuthenticated} onClick={() => submitSolutionCallback()}>Submit</Button>
                        <Button variant="secondary" onClick={() => canceled()}>Cancel</Button>
                      </ButtonGroup>
                    </Col>
                    <Col md={8}>
                      <SubmissionCodeViewer code={fileText || ''} language={getGeneralLanguageName(language || undefined)} />
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

export default TaskSolutionDropZone;
