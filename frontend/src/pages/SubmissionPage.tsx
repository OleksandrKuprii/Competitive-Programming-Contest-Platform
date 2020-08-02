import * as React from 'react';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Grid, Row, JustifyContent} from '@/toucanui/atoms/grid';
import {Table, TableCol} from '@/toucanui/molecules/table';
import CodeViewer from '@/molecules/codeViewer';
import Result from '@/atoms/result';
import {Text, Title, TextAlign, FontWeight} from '@/toucanui/atoms/typography';
import {Submission} from '~/typings/entities/submission';
import PrettyDate from "@/toucanui/atoms/prettyDate";
import Loading from "@/toucanui/atoms/loading";
import {Link} from "react-router-dom";
import Page from '@/toucanui/templates/page';
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";

interface SubmissionPageProps {
  submission: Submission;
}

const SubmissionPage: FC<SubmissionPageProps> = ({submission}) => {
  const {t} = useTranslation();

  return (
    <Page>
      <Grid>
        {submission.tests && <>
          <Row>
            <Table cols={4}>
              <TableCol header>#</TableCol>
              <TableCol header>{t('headers.result')}</TableCol>
              <TableCol header>{t('headers.cpuTime')}</TableCol>
              <TableCol header>{t('headers.realtime')}</TableCol>

              {submission.tests.map((test, i) => (
                // TODO: fix this
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={i}>
                  <TableCol>{i + 1}</TableCol>
                  <TableCol>
                    <Result
                      points={test.points}
                      status={[test.status]}
                    />
                  </TableCol>
                  <TableCol>
                    {(test.cpuTime !== null && test.cpuTime !== undefined) ? `${test.cpuTime}ms` : '-'}
                  </TableCol>
                  <TableCol>
                    {(test.realTime !== null && test.realTime !== undefined) ? `${test.realTime}ms` : '-'}
                  </TableCol>
                </React.Fragment>
              ))}
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

        <Spacer top={Padding.Medium}/>

        {(submission.language && submission.code) && (
          <div style={{height: 500}}>
            <CodeViewer language={submission.language}>
              {submission.code}
            </CodeViewer>
          </div>
        )}
      </Grid>
    </Page>
  );
};

export default memo(SubmissionPage);
