import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SubmissionCodeViewer from '../components/submission/SubmissionCodeViewer';
import CustomTable, { CustomTableRow } from '../components/CustomTable';
import PrettyDate from '../components/PrettyDate';
import Result from '../components/result/Result';
import TaskLinkByTask from '../components/task/TaskLinkByTask';
import { useStoreState, useStoreActions } from '../hooks/store';
import { Submission } from '../models/submissionModel';
import { Task } from '../models/taskModel';
import getGeneralLanguageName from '../utils/getGeneralLanguageName';
import ErrorPage from './ErrorPage';
import Loading from '../components/Loading';


const SubmissionPage = () => {
  const { id: idStr } = useParams();

  const id = parseInt(idStr as string, 10);

  const token = useStoreState((state) => state.auth0.token);
  const authLoading = useStoreState((state) => state.auth0.loading.loading);

  const fetchSubmission = useStoreActions((actions) => actions.taskSubmission.fetchSubmission);

  useEffect(() => {
    if (!Number.isInteger(id) || !token) {
      return;
    }

    fetchSubmission({ id, token });
  }, [fetchSubmission, id, token]);

  const [submission, task]: [Submission | undefined, Task | undefined] = useStoreState(
    (state) => {
      if (Number.isNaN(id)) {
        return [undefined, undefined];
      }

      const localSubmission = state.taskSubmission.submission.list.find(
        (s: Submission) => s.id === id,
      );

      if (localSubmission === undefined) {
        return [undefined, undefined];
      }

      const localTask = state.taskSubmission.task.list.find(
        (ta: Task) => ta.alias === localSubmission.taskAlias,
      );

      return [localSubmission, localTask];
    },
  );

  if (authLoading) {
    return (
      <Loading />
    );
  }

  if (task === undefined || submission === undefined) {
    return (
      <ErrorPage code="notFound" />
    );
  }

  if (submission.loading) {
    return (
      <Loading />
    );
  }

  const infoTableRow: CustomTableRow = {
    id: `${submission.submitted}-${submission.status}`,
    row: (
      <>
        <td>
          <TaskLinkByTask taskName={task.name || ''} alias={task.alias} />
        </td>
        <td>
          {submission.submitted === undefined
            ? ''
            : <PrettyDate timestamp={submission.submitted} />}
        </td>
        <td>
          {submission.status === undefined
            ? ''
            : <Result points={submission.points} status={submission.status} />}
        </td>
      </>
    ),
  };

  const infoTable = (
    <CustomTable tableName="info" headers={['task', 'submitted', 'result']} rows={[infoTableRow]} />
  );

  const testsTableRows: CustomTableRow[] = submission.tests === undefined
    ? [] : submission.tests.map(
      ({
        points, status, cpuTime, realtime,
      }, i) => ({
        id: `${points}-${status}-${cpuTime}-${realtime}`,
        row: (
          <>
            <td>{i}</td>
            <td>
              <Result points={points} status={[status]} />
            </td>
            <td>
              {cpuTime === undefined
                ? ''
                : `${cpuTime}ms`}
            </td>
            <td>
              {realtime === undefined
                ? ''
                : `${realtime}ms`}
            </td>
          </>
        ),
      }),
    );

  const testsTable = (
    <CustomTable
      tableName="submissionTests"
      headers={['id', 'result', 'cpuTime', 'realtime']}
      rows={testsTableRows}
    />
  );

  return (
    <Row>
      <Col md={5}>
        <p className="h3">
          Submission #
          {submission.id}
        </p>

        <p className="description">
          Overall results
        </p>

        {infoTable}

        {submission.tests !== undefined
          ? (
            <>
              <p className="description">
                Results per test
              </p>

              {testsTable}
            </>
          )
          : null}
      </Col>
      <Col>
        <p><b>{submission.language}</b></p>
        {submission.code === undefined
          ? null
          : (
            <SubmissionCodeViewer
              code={submission.code}
              language={getGeneralLanguageName(submission.language)}
            />
          )}
      </Col>
    </Row>
  );
};
export default SubmissionPage;
