import * as React from 'react';
import {
  Container, Nav, Navbar,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  GiPaperPlane, FaHome, GiArcheryTarget, GiBrutalHelm,
} from 'react-icons/all';
import uuid from 'react-uuid';
import ProfileStatus from './ProfileStatus';

const ToucanNavbar = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const navigation = [
    {
      link: '/',
      pageName: 'home',
      icon: FaHome,
    },
    {
      link: '/tournaments',
      pageName: 'tournaments',
      icon: GiBrutalHelm,
    },
    {
      link: '/tasks',
      pageName: 'tasks',
      icon: GiArcheryTarget,
    },
    {
      link: '/submissions',
      pageName: 'submissions',
      icon: GiPaperPlane,
    },
  ]
    .map((item) => ({
      ...item,
      active: item.link === history.location.pathname,
    }))
    .map((item) => (
      <Nav.Link key={uuid()} active={item.active} disabled={item.active} href={`#${item.link}`}>
        <item.icon />
        {' '}
        {t(`pageName.${item.pageName}`)}
      </Nav.Link>
    ))
    .map((link) => (
      <Nav.Item key={uuid()}>
        {link}
      </Nav.Item>
    ));

  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container style={{ padding: 0 }}>
        {navigation}
        <Nav className="mr-auto" />
        <Nav.Item>
          <ProfileStatus />
        </Nav.Item>
      </Container>
    </Navbar>
  );
};

export default ToucanNavbar;
