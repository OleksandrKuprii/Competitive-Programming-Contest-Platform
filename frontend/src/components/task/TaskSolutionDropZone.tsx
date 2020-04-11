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
import Loading from '../Loading';

export interface SolutionDropZoneArgs {
  taskAlias: string
}

const TaskSolutionDropZone = ({ taskAlias }: SolutionDropZoneArgs) => {
  const { t } = useTranslation();

  const [dragEntered, setDragEntered] = React.useState(false);

  const code = useStoreState((state) => state.solutionSubmission.code);
  const language = useStoreState((state) => state.solutionSubmission.language);
  const filename = useStoreState((state) => state.solutionSubmission.filename);
  const fileLoading = useStoreState((state) => state.solutionSubmission.loading.flag);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const uploadFile = useStoreActions((state) => state.solutionSubmission.uploadFile);
  const selectedLanguage = useStoreActions((state) => state.solutionSubmission.selectedLanguage);
  const submit = useStoreActions((state) => state.solutionSubmission.submit);
  const canceled = useStoreActions((state) => state.solutionSubmission.canceled);

  const languages = ['python3', 'python2', 'c++', 'c'];

  const submitSolutionCallback = useCallback(async () => {
    submit(taskAlias);
  },
  [submit, taskAlias]);

  if (fileLoading) {
    return <Loading />;
  }

  return (
    <Dropzone
      multiple={false}
      disabled={code !== undefined}
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
              {code === undefined ? t('taskPage.dropFileHere')
                : (
                  <Row>
                    <Col>
                      <p className="h4 text-center">{filename}</p>

                      <FormControl
                        as="select"
                        onChange={(e) => selectedLanguage((e.target as HTMLSelectElement).value)}
                        value={language || languages[0]}
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
                      <SubmissionCodeViewer code={code || ''} language={getGeneralLanguageName(language || undefined)} />
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
