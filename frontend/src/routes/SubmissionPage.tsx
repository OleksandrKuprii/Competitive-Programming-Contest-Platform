import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import CodeViewer from '../components/CodeViewer';
import CustomTable, { CustomTableRow } from '../components/CustomTable';
import PrettyDate from '../components/PrettyDate';
import { Result } from '../components/Result';
import { TaskNameLinkByTask } from '../components/TaskNameLink';
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

  const infoTableRow: CustomTableRow = [
    (<TaskNameLinkByTask taskName={task.name || ''} alias={task.alias} />),
    (submission.submitted === undefined ? '' : <PrettyDate timestamp={submission.submitted} />),
    (submission.status === undefined ? '' : <Result points={submission.points} status={submission.status} />),
  ];

  const infoTable = (
    <CustomTable headers={['task', 'submitted', 'result']} rows={[infoTableRow]} />
  );

  const testsTableRows: CustomTableRow[] = submission.tests === undefined
    ? [] : submission.tests.map(
      ({
        points, status, cpuTime, realtime,
      }, i) => ([
        (i.toString()),
        (<Result points={points} status={[status]} />),
        (cpuTime !== undefined ? `${cpuTime}ms` : ''),
        (realtime !== undefined ? `${realtime}ms` : ''),
      ]),
    );

  const testsTable = (
    <CustomTable headers={['id', 'result', 'cpuTime', 'realtime']} rows={testsTableRows} />
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
            <CodeViewer
              code={submission.code}
              language={getGeneralLanguageName(submission.language)}
            />
          )}
      </Col>
    </Row>
  );
};
export default SubmissionPage;
