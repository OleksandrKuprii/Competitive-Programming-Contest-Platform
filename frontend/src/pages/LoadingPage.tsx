import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import Loading from '../components/atoms/loading';
import { Spacer } from '../components/atoms/spacers';
import { Title } from '../components/atoms/typography';
import { Grid, Row } from '../components/atoms/grid';

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
