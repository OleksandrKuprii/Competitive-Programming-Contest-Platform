import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import Loading from '@/atoms/loading';
import { Spacer } from '@/atoms/spacers';
import { Title } from '@/atoms/typography';
import { Grid, Row } from '@/atoms/grid';

const LoadingContainer = styled.div``;

const LoadingPage: FC = () => (
  <LoadingContainer>
    <Grid>
      <Spacer />
      <Row justifyContent="center">
        <Loading size={200} variant="loading" />
      </Row>
      <Spacer />
      <Title align="center">Fetching data...</Title>
    </Grid>
  </LoadingContainer>
);

export default LoadingPage;
