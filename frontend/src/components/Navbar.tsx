import * as React from 'react';
import {
  Col, Container, Nav, Navbar, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const ToucanNavbar = () => {
  const { t } = useTranslation();

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Nav className="mr-auto">
          <Row>
            <Col>
              <Link to="/" style={{ fontWeight: 'bold', paddingLeft: 20, paddingRight: 50 }}>
                {t('brandname')}
              </Link>
            </Col>
            <Col>
              <Link to="/tournaments">{t('pagename.tournaments')}</Link>
            </Col>
            <Col>
              <Link to="/tasks">{t('pagename.tasks')}</Link>
            </Col>
            <Col>
              <Link to="/submissions">{t('pagename.submissions')}</Link>
            </Col>
          </Row>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default ToucanNavbar;
