import * as React from 'react';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Grid, Row, JustifyContent} from '@/toucanui/atoms/grid';
import Table from '@/molecules/table';
import CodeViewer from '@/molecules/codeViewer';
import Result from '@/atoms/result';
import Link from '@/toucanui/atoms/link';
import {Text, Title, TextAlign, FontWeight} from '@/toucanui/atoms/typography';
import {Submission} from '~/typings/entities/submission';
import PrettyDate from "@/toucanui/atoms/prettyDate";
import Loading from "@/toucanui/atoms/loading";

interface SubmissionPageProps {
  submission: Submission;
}

const SubmissionPage: FC<SubmissionPageProps> = ({submission}) => {
  const {t} = useTranslation();

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
                    {(submission.status && submission.points) &&
                    <Result status={submission.status} points={submission.points}/>}
                  </td>
                  <td>
                    <PrettyDate timestamp={submission.submitted}/>
                  </td>
                </tr>
                </tbody>
              </Table>
            </Row>

            {submission.tests && <>
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
                  {submission.tests.map((test, i) => (
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
                        {test.cpuTime || '-'}
                      </td>
                      <td>
                        {test.realTime || '-'}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </Table>
              </Row>

              <Row>
                {submission.testCount !== undefined &&
                submission.tests.length < submission.testCount ? (
                  <>
                    <Grid>
                      <Row justifyContent={JustifyContent.Center}>
                        <Loading variant="running"/>
                      </Row>
                    </Grid>

                    <Text align={TextAlign.Center} weight={FontWeight.Bold} style={{fontSize: 18}}>
                      Running
                    </Text>
                  </>
                ) : undefined}
              </Row>
            </>}
          </Grid>
        </Col>
        <Col style={{maxWidth: '60%'}}>
          {(submission.language && submission.code) &&
            <CodeViewer language={submission.language}>
              {submission.code}
            </CodeViewer>
          }
        </Col>
      </Row>
    </Grid>
  );
};

export default memo(SubmissionPage);
