import * as React from 'react';
import { FC } from 'react';
import Loading from '@/atoms/loading';
import { Title, TextAlign } from '@/atoms/typography';
import { Grid, Row, JustifyContent } from '@/atoms/grid';

interface LoadingPageProps {
  customText?: string;
}

const LoadingPage: FC<LoadingPageProps> = ({ customText }) => (
  <Grid>
    <Row justifyContent={JustifyContent.Center}>
      <Loading size={200} variant="loading" />
    </Row>
    <Title align={TextAlign.Center}>{customText || 'Fetching data...'}</Title>
  </Grid>
);

export default LoadingPage;
