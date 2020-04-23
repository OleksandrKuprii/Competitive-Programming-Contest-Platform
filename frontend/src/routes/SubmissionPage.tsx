import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SubmissionCodeViewer from '../components/submission/SubmissionCodeViewer';
import CustomTable, { CustomTableRow } from '../components/table/CustomTable';
import PrettyDate from '../components/formatters/PrettyDate';
import Result from '../components/result/Result';
import { useStoreState, useStoreActions } from '../hooks/store';
import Loading from '../components/layout/Loading';
import TaskLinkByAlias from '../components/task/TaskLinkByAlias';
import LanguageIdentifier from '../components/formatters/LanguageIdentifier';

const SubmissionPage = () => {
  const { id: idStr } = useParams();

  const id = idStr ? parseInt(idStr, 10) : undefined;

  const submission = useStoreState((state) =>
    id ? state.submission.byId(id) : undefined,
  );
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const isHunting = useStoreState((state) =>
    id ? state.submissionHunter.isHunting(id) : undefined,
  );

  const fetchSubmission = useStoreActions(
    (actions) => actions.submission.fetchOne,
  );
  const signIn = useStoreActions((actions) => actions.auth0.signIn);

  useEffect(() => {
    if (!isAuthenticated) {
      signIn();
    }
  }, [isAuthenticated, signIn]);

  const needFetch = !isHunting && !submission?.tests;

  useEffect(() => {
    if (!id) {
      return;
    }

    if (needFetch) {
      fetchSubmission(id);
    }
  }, [id, needFetch, isHunting, fetchSubmission]);

  if (submission?.loading || isHunting) {
    if (submission && submission.status) {
      if (submission.status[0] === 'Running') {
        return <Loading variant="running" />;
      }
    }

    return <Loading variant={isHunting ? 'processing' : 'loading'} />;
  }

  const infoTableRow: CustomTableRow = {
    id: `${submission?.submitted}-${submission?.status}`,
    row: (
      <>
        <td>
          <TaskLinkByAlias id={submission?.taskAlias} />
        </td>
        <td>
          {submission?.submitted === undefined ? (
            ''
          ) : (
            <PrettyDate timestamp={submission.submitted} />
          )}
        </td>
        <td>
          {submission?.status === undefined ? (
            ''
          ) : (
            <Result points={submission?.points} status={submission?.status} />
          )}
        </td>
      </>
    ),
  };

  const infoTable = (
    <CustomTable
      tableName="info"
      headers={['task', 'submitted', 'result']}
      rows={[infoTableRow]}
    />
  );

  const testsTableRows: CustomTableRow[] =
    submission?.tests === undefined
      ? []
      : submission.tests.map(({ points, status, cpuTime, realtime }, i) => ({
          id: i,
          row: (
            <>
              <td>{i + 1}</td>
              <td>
                <Result points={points} status={[status]} />
              </td>
              <td>{!cpuTime ? '-' : `${cpuTime}ms`}</td>
              <td>{!realtime ? '-' : `${realtime}ms`}</td>
            </>
          ),
        }));

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
        <Row>
          <Col>
            <p className="h3">Submission #{submission?.id}</p>

            <p className="description">Overall results</p>
          </Col>

          <Col className="text-right">
            <LanguageIdentifier
              language={submission?.language || ''}
              size="lg"
            />
          </Col>
        </Row>

        {infoTable}

        {submission?.tests !== undefined ? (
          <>
            <p className="description">Results per test</p>

            {testsTable}
          </>
        ) : null}
      </Col>
      <Col>
        {submission?.code === undefined ? null : (
          <SubmissionCodeViewer
            code={submission?.code}
            language={submission.language || ''}
          />
        )}
      </Col>
    </Row>
  );
};
export default SubmissionPage;
