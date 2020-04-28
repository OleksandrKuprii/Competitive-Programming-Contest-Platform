import * as React from 'react';
import { Badge, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { GiChessKnight, GiStarsStack } from 'react-icons/all';

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Jumbotron className="text-center">
        <div style={{ paddingTop: 50 }} />

        <p className="h1">{t('homepage.welcome')}</p>
        <p className="subtitle">{t('homepage.description')}</p>

        <div style={{ paddingTop: 50 }} />

        <Row>
          <Col className="bg-dark rounded m-4 p-5">
            <p className="display-1">
              <GiChessKnight />
            </p>

            <p className="h4">Play in tournaments</p>
            <Badge variant="danger">Coming soon</Badge>
          </Col>

          <Col className="bg-dark rounded m-4 p-5">
            <p className="display-1">
              <GiStarsStack />
            </p>

            <p className="h4">Practice solving public tasks</p>
          </Col>
        </Row>
      </Jumbotron>
    </>
  );
};

export default Homepage;
