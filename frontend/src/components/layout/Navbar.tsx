import * as React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  GiPaperPlane,
  FaHome,
  GiArcheryTarget,
  GiBrutalHelm,
} from 'react-icons/all';
import ProfileStatus from '../user/ProfileStatus';

const ToucanNavbar = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const navigation = [
    {
      link: '/',
      pageName: 'home',
      icon: <FaHome />,
    },
    {
      link: '/tournaments',
      pageName: 'tournaments',
      icon: <GiBrutalHelm />,
    },
    {
      link: '/tasks',
      pageName: 'tasks',
      icon: <GiArcheryTarget />,
    },
    {
      link: '/submissions',
      pageName: 'submissions',
      icon: <GiPaperPlane />,
    },
  ]
    .map((item) => ({
      ...item,
      active: item.link === history.location.pathname,
    }))
    .map(({ active, link, pageName, icon }) => (
      <Nav.Item key={`header-${pageName}-${link}`}>
        <Nav.Link active={active} disabled={active} href={`#${link}`}>
          {icon} {t(`pageName.${pageName}`)}
        </Nav.Link>
      </Nav.Item>
    ));

  return (
    <Navbar expand="lg" bg="primary" variant="dark" sticky="top">
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
