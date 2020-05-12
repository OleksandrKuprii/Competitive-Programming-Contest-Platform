import * as React from 'react';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Grid, Row } from '@/atoms/grid';
import Table from '@/molecules/table';
import PrettyDate from '@/atoms/prettyDate';
import Loading from '@/atoms/loading';
import Defined from '@/helpers/defined';
import CodeViewer from '@/molecules/codeViewer';
import Result from '@/atoms/result';
import Link from '@/atoms/link';
import { Paragraph, Title } from '@/atoms/typography';
import { Spacer } from '@/atoms/spacers';
import { Submission } from '~/typings/entities/submission';

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
                  <Spacer size={20} />

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
