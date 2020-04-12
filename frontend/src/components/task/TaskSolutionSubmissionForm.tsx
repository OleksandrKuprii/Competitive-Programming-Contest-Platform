import * as React from 'react';
import Form from 'react-bootstrap/Form';
import {
  Alert,
  Button, ButtonGroup, Col,
} from 'react-bootstrap';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreState, useStoreActions } from '../../hooks/store';
import SubmissionCodeViewer from '../submission/SubmissionCodeViewer';

const TaskSolutionSubmissionForm = () => {
  const { taskAlias } = useParams();

  const code = useStoreState((state) => state.solutionSubmission.code);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const canceled = useStoreActions((actions) => actions.solutionSubmission.canceled);
  const submit = useStoreActions((actions) => actions.solutionSubmission.submit);

  const cancelCallback = useCallback(() => {
    canceled();
  }, [canceled]);

  const submitCallback = useCallback(() => {
    if (!taskAlias) {
      return;
    }

    submit(taskAlias);
  }, [submit, taskAlias]);

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <SubmissionCodeViewer code={code || ''} language="python3" />
        </Form.Group>
      </Form.Row>

      {!isAuthenticated
        ? (
          <Alert variant="danger">
            Sign in to submit solution!
          </Alert>
        ) : <></>}

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Control as="select">
            <option>python3</option>
            <option>python2</option>
            <option>c++</option>
            <option>c</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <ButtonGroup>
            <Button variant="primary" disabled={!isAuthenticated} onClick={submitCallback}>
              Submit
            </Button>
            <Button variant="outline-danger" onClick={cancelCallback}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form.Group>
      </Form.Row>
    </Form>
  );
};

export default TaskSolutionSubmissionForm;
