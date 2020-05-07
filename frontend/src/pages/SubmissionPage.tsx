import * as React from 'react';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { Submission } from '../models/interfaces';
import StyledTable from '../components/atoms/styledTable';
import BlockLink from '../components/atoms/blockLink';
import Result from '../components/atoms/result';
import Defined from '../components/atoms/defined';
import CodeViewer from '../components/atoms/codeViewer';
import Loading from '../components/atoms/loading';
import PrettyDate from '../components/atoms/prettyDate';

interface SubmissionPageProps {
  submission: Submission;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ submission }) => {
  const { t } = useTranslation();

  return (
    <Row>
      <Col md={5}>
        <Row>
          <Col>
            <p className="h3">Submission #{submission.id}</p>

            <p className="description">Overall results</p>
          </Col>
        </Row>

        <StyledTable>
          <thead>
            <tr>
              <th>{t('headers.task')}</th>
              <th>{t('headers.result')}</th>
              <th>{t('headers.submitted')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <BlockLink onClick={`/task/view/${submission.taskId}`}>
                  {submission.taskName}
                </BlockLink>
              </td>
              <td>
                <Defined value={submission.status}>
                  {(definedStatus) => (
                    <Defined value={submission.points}>
                      {(definedPoints) => (
                        <Result status={definedStatus} points={definedPoints} />
                      )}
                    </Defined>
                  )}
                </Defined>
              </td>
              <td>
                <PrettyDate timestamp={submission.submitted} />
              </td>
            </tr>
          </tbody>
        </StyledTable>

        <Defined value={submission.tests}>
          {(definedTests) => (
            <>
              <p className="description">Results per test</p>

              <StyledTable>
                <thead>
                  <th>#</th>
                  <th>{t('headers.result')}</th>
                  <th>{t('headers.cpuTime')}</th>
                  <th>{t('headers.realtime')}</th>
                </thead>

                <tbody>
                  {definedTests.map((test, i) => (
                    // TODO: fix this
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Result points={test.points} status={[test.status]} />
                      </td>
                      <td>
                        <Defined value={test.cpuTime} fallback={<>-</>}>
                          {(definedCpuTime) => <>{definedCpuTime}ms</>}
                        </Defined>
                      </td>
                      <td>
                        <Defined value={test.realTime} fallback={<>-</>}>
                          {(definedRealtime) => <>{definedRealtime}ms</>}
                        </Defined>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
              {submission.testCount !== undefined &&
              definedTests.length < submission.testCount ? (
                <Loading variant="running" />
              ) : undefined}
            </>
          )}
        </Defined>
      </Col>
      <Col md={7}>
        <Defined value={submission?.code}>
          {(definedCode) => (
            <Defined value={submission?.language}>
              {(definedLanguage) => (
                <CodeViewer language={definedLanguage}>
                  {definedCode}
                </CodeViewer>
              )}
            </Defined>
          )}
        </Defined>
      </Col>
    </Row>
  );
};
export default memo(SubmissionPage);
