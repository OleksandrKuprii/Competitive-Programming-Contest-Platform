import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GiChessKnight, GiStarsStack } from 'react-icons/all';
import { Col, Grid, Row } from '../components/atoms/grid';
import { BigTitle, Paragraph, Subtitle } from '../components/atoms/typography';
import { Spacer } from '../components/atoms/spacers';

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Row>
        <Col size={2}>
          <Spacer />
          <BigTitle>{t('homepage.welcome')}</BigTitle>
          <Subtitle>{t('homepage.description')}</Subtitle>
          <Spacer />
        </Col>

        <Col>
          <Grid justifyContent="center">
            <Row justifyContent="center">
              <BigTitle>
                <GiChessKnight />
              </BigTitle>
            </Row>
            <Row justifyContent="center">
              <Paragraph>Play in tournaments</Paragraph>
            </Row>
          </Grid>
        </Col>

        <Col>
          <Grid justifyContent="center">
            <Row justifyContent="center">
              <BigTitle>
                <GiStarsStack />
              </BigTitle>
            </Row>
            <Row justifyContent="center">
              <Paragraph>Practice solving public tasks</Paragraph>
            </Row>
          </Grid>
        </Col>
      </Row>
    </>
  );
};

export default Homepage;
