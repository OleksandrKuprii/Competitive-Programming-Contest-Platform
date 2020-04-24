import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreState, useStoreActions } from '../../hooks/store';
import SubmissionCodeViewer from '../submission/SubmissionCodeViewer';

const TaskSolutionSubmissionForm = () => {
  const { taskAlias } = useParams();

  const code = useStoreState((state) => state.solutionSubmission.code);
  const language = useStoreState((state) => state.solutionSubmission.language);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const canceled = useStoreActions(
    (actions) => actions.solutionSubmission.canceled,
  );
  const submit = useStoreActions(
    (actions) => actions.solutionSubmission.submit,
  );
  const selectedLanguage = useStoreActions(
    (actions) => actions.solutionSubmission.selectedLanguage,
  );

  const cancelCallback = useCallback(() => {
    canceled();
  }, [canceled]);

  const submitCallback = useCallback(() => {
    if (!taskAlias) {
      return;
    }

    submit(taskAlias);
  }, [submit, taskAlias]);

  const languages = ['python3', 'python2', 'c++', 'c', 'pascal'];

  return (
    <div className="bg-secondary p-4 rounded">
      <Form>
        <Form.Row>
          <SubmissionCodeViewer code={code || ''} language="python3" />
        </Form.Row>

        {!isAuthenticated ? (
          <Alert variant="danger">Sign in to submit solution!</Alert>
        ) : (
          <></>
        )}

        <Form.Row>
          <Form.Control
            style={{ maxWidth: 200 }}
            as="select"
            value={language}
            onChange={(e) => selectedLanguage((e.target as any).value)}
          >
            {languages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </Form.Control>
          <div style={{ paddingLeft: 10 }} />
          <ButtonGroup>
            <Button
              variant="primary"
              disabled={!isAuthenticated}
              onClick={submitCallback}
            >
              Submit
            </Button>
            <Button variant="outline-danger" onClick={cancelCallback}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form.Row>
      </Form>
    </div>
  );
};

export default TaskSolutionSubmissionForm;
