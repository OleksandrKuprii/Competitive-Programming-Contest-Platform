import { useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CodeViewer from '../components/CodeViewer';
import CustomTable, { CustomTableRow } from '../components/CustomTable';
import PrettyDate from '../components/PrettyDate';
import { Result } from '../components/Result';
import { Task } from '../components/TaskList';
import { TaskNameLinkByTask } from '../components/TaskNameLink';
import { Submission } from '../models/submissionModel';
import getGeneralLanguageName from '../utils/getGeneralLanguageName';


const SubmissionPage = () => {
  const { id } = useParams();

  const [submission, task]: [Submission, Task] = useStoreState(
    (state: any) => {
      if (id === undefined) {
        return [undefined, undefined];
      }

      const localSubmission = state.submission.list.find(
        (s: Submission) => s.id === parseInt(id, 10),
      );

      const localTask = state.publictasks.find(
        (ta: Task) => ta.alias === localSubmission.taskAlias,
      );

      return [localSubmission, localTask];
    },
  );

  if (submission === undefined) {
    return <></>;
  }


  const infoTableRow: CustomTableRow = [
    (<TaskNameLinkByTask taskName={task.taskName} alias={task.alias} />),
    (<PrettyDate timestamp={submission.submitted} />),
    (<Result points={submission.points} status={submission.status} />),
  ];

  const infoTable = (
    <CustomTable headers={['task', 'submitted', 'result']} rows={[infoTableRow]} />
  );

  const testsTableRows: CustomTableRow[] = submission.tests.map(
    ({
      points, status, cputime, realtime,
    }, i) => ([
      (i.toString()),
      (<Result points={points} status={[status]} />),
      (`${cputime}ms`),
      (`${realtime}ms`),
    ]),
  );

  const testsTable = (
    <CustomTable headers={['id', 'result', 'cputime', 'realtime']} rows={testsTableRows} />
  );

  return (
    <Row>
      <Col md={5}>
        <p className="h3">
          Submission #
          {submission.id}
        </p>

        <p className="h5">
          Overall results
        </p>

        {infoTable}

        {submission.tests.length > 0
          ? (
            <>
              <p className="h5">
                Results per test
              </p>

              {testsTable}
            </>
          )
          : null}
      </Col>
      <Col>
        <p><b>{submission.language}</b></p>
        <CodeViewer code={submission.code} language={getGeneralLanguageName(submission.language)} />
      </Col>
    </Row>
  );
};
export default SubmissionPage;
