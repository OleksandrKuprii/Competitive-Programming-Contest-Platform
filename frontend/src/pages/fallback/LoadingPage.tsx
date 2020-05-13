import * as React from 'react';
import { FC } from 'react';
import Loading from '@/atoms/loading';
import { Spacer } from '@/atoms/spacers';
import { Title } from '@/atoms/typography';
import { Grid, Row } from '@/atoms/grid';

interface LoadingPageProps {
  customText?: string;
}

const LoadingPage: FC<LoadingPageProps> = ({ customText }) => (
  <Grid>
    <Spacer />
    <Row justifyContent="center">
      <Loading size={200} variant="loading" />
    </Row>
    <Spacer />
    <Title align="center">{customText || 'Fetching data...'}</Title>
  </Grid>
);

export default LoadingPage;
