import * as React from 'react';
import { FC } from 'react';
import { Title, TextAlign } from '@/toucanui/atoms/typography';
import { Grid, Row, JustifyContent } from '@/toucanui/atoms/grid';
import Loading from "@/toucanui/atoms/loading";

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
