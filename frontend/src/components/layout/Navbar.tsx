import * as React from 'react';
import { Container, Nav, Navbar, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  GiPaperPlane,
  GiArcheryTarget,
  GiBrutalHelm,
  FiUser,
} from 'react-icons/all';
import memoize from 'memoizee';
import ProfileStatus from '../user/ProfileStatus';

const brandIcon = require('../../assets/brandIcon.png');

const navigationEntries = [
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
  {
    link: '/profile/my',
    pageName: 'profile',
    icon: <FiUser />,
  },
];

const getNavigation = memoize(
  (pathname: string, t: any) =>
    navigationEntries
      .map((item) => ({
        ...item,
        active: item.link === pathname,
      }))
      .map(({ active, link, pageName, icon }) => (
        <Nav.Item key={`header-${pageName}-${link}`}>
          <Nav.Link active={active} disabled={active} href={`#${link}`}>
            {icon} {t(`pageName.${pageName}`)}
          </Nav.Link>
        </Nav.Item>
      )),
  { primitive: true, length: 1 },
);

const ToucanNavbar = () => {
  const { t } = useTranslation();

  const { pathname } = useHistory().location;

  const navigation = getNavigation(pathname, t);

  return (
    <Navbar expand="lg" bg="primary" variant="dark" sticky="top">
      <Container style={{ padding: 0 }}>
        <Navbar.Brand href="#/">
          <Image src={brandIcon} height={30} className="d-inline-block" />{' '}
          Toucan
        </Navbar.Brand>

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
