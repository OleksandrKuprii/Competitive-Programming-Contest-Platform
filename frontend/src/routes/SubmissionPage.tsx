import { useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { Submission } from '../models/submissionModel';
import { Task } from '../components/TaskList';
import PrettyDate from '../components/PrettyDate';
import { Result } from '../components/Result';
import CodeViewer from '../components/CodeViewer';
import getGeneralLanguageName from '../utils/getGeneralLanguageName';


const SubmissionPage = () => {
  const { t } = useTranslation();

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


  return (
    <Row>
      <Col md={5}>
        <Row>
          <p className="h3">
            {t('submission')}
            {' #'}
            {submission.id}
          </p>
        </Row>

        <Row>
          <p>
            {t('headers.task')}
            {': '}
            {task.taskName}
          </p>
        </Row>
        <Row>
          <p>
            {t('headers.submitted')}
            {': '}
            <PrettyDate timestamp={submission.submitted} />
          </p>
        </Row>
        <Row>
          <p>
            {t('headers.result')}
            {': '}
            <Result points={submission.points} status={submission.status} />
          </p>
        </Row>

        <div style={{ paddingTop: 50 }} />

        {submission.tests.length > 0 ? (
          <Row key={uuid()}>
            <Table striped hover variant="dark" size="sm" borderless>
              <thead className="customhead">
                <tr>
                  <th>#</th>
                  <th>{t('headers.result')}</th>
                  <th>{t('headers.cputime')}</th>
                  <th>{t('headers.realtime')}</th>
                </tr>
              </thead>

              <tbody>
                {submission.tests.map((test, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <Result points={test.points} status={[test.status]} />
                    </td>
                    <td>
                      {test.cputime}
                      ms
                    </td>
                    <td>
                      {test.realtime}
                      ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        ) : null}
      </Col>
      <Col>
        <p><b>{submission.language}</b></p>
        <CodeViewer code={submission.code} language={getGeneralLanguageName(submission.language)} />
      </Col>
    </Row>
  );
};
export default SubmissionPage;
