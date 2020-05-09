import * as React from 'react';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Grid, Row } from '../components/atoms/grid';
import Table from '../components/molecules/table';
import { Submission } from '../models/interfaces';
import PrettyDate from '../components/atoms/prettyDate';
import Loading from '../components/atoms/loading';
import Defined from '../components/helpers/defined';
import CodeViewer from '../components/atoms/codeViewer';
import Result from '../components/atoms/result';
import Link from '../components/atoms/link';
import { Paragraph, Subtitle, Title } from '../components/atoms/typography';
import { Spacer } from '../components/atoms/spacers';

interface SubmissionPageProps {
  submission: Submission;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ submission }) => {
  const { t } = useTranslation();

  return (
    <Grid>
      <Row>
        <Title>Submission #{submission.id}</Title>
      </Row>

      <Row>
        <Col>
          <Grid>
            <Row>
              <Table>
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
                      <Link href={`#/task/view/${submission.taskId}`}>
                        {submission.taskName}
                      </Link>
                    </td>
                    <td>
                      <Defined value={submission.status}>
                        {(definedStatus) => (
                          <Defined value={submission.points}>
                            {(definedPoints) => (
                              <Result
                                status={definedStatus}
                                points={definedPoints}
                              />
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
              </Table>
            </Row>
            <Defined value={submission.tests}>
              {(definedTests) => (
                <>
                  <Row>
                    <Subtitle>Results per test</Subtitle>
                  </Row>

                  <Row>
                    <Table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t('headers.result')}</th>
                          <th>{t('headers.cpuTime')}</th>
                          <th>{t('headers.realtime')}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {definedTests.map((test, i) => (
                          // TODO: fix this
                          // eslint-disable-next-line react/no-array-index-key
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <Result
                                points={test.points}
                                status={[test.status]}
                              />
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
                    </Table>
                  </Row>

                  <Row>
                    {submission.testCount !== undefined &&
                    definedTests.length < submission.testCount ? (
                      <Container>
                        <Spacer />

                        <Grid>
                          <Row justifyContent="center">
                            <Loading variant="running" />
                          </Row>
                        </Grid>

                        <Paragraph align="center" bold style={{ fontSize: 18 }}>
                          Running
                        </Paragraph>
                      </Container>
                    ) : undefined}
                  </Row>
                </>
              )}
            </Defined>
          </Grid>
        </Col>
        <Col style={{ maxWidth: '60%' }}>
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
    </Grid>
  );
};

export default memo(SubmissionPage);
