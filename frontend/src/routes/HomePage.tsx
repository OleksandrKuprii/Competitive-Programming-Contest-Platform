import * as React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ProfileInfo from '../components/ProfileInfo';

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Row>
        <Col>
          <Jumbotron className="p-4">
            <p className="h1 m-0">{t('homepage.welcome')}</p>
            <p className="subtitle">{t('homepage.description')}</p>
            <p>
              <Button variant="primary">{t('learnMore')}</Button>
            </p>
          </Jumbotron>
        </Col>
      </Row>

      <Row>
        <Col>
          <ProfileInfo />
        </Col>
      </Row>
    </>
  );
};

export default Homepage;
