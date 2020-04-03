import * as React from 'react';
import {
  Container, Nav, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ProfileStatus from './ProfileStatus';

const CustomLink = ({ children, to }: { children: React.Component, to: string }) => (
  <Link to={to} component={Nav.Link}>{children}</Link>
);


const ToucanNavbar = () => {
  const { t } = useTranslation();

  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container style={{ padding: 0 }}>
        <Nav className="mr-auto">
          <Nav.Item>
            <CustomLink to="/">
              {t('pageName.home')}
            </CustomLink>
          </Nav.Item>
          <Nav.Item>
            <CustomLink to="/tournaments">
              {t('pageName.tournaments')}
            </CustomLink>
          </Nav.Item>
          <Nav.Item>
            <CustomLink to="/tasks">
              {t('pageName.tasks')}
            </CustomLink>
          </Nav.Item>
          <Nav.Item>
            <CustomLink to="/submissions">
              {t('pageName.submissions')}
            </CustomLink>
          </Nav.Item>
        </Nav>
        <Nav.Item>
          <ProfileStatus />
        </Nav.Item>
      </Container>
    </Navbar>
  );
};

export default ToucanNavbar;
