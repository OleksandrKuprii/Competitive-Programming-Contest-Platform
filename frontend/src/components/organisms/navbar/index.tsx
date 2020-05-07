import * as React from 'react';
import {
  Container,
  Nav,
  Navbar as BaseNavbar,
  Image,
  NavbarBrand,
  NavItem,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  GiPaperPlane,
  GiArcheryTarget,
  GiBrutalHelm,
  FiUser,
} from 'react-icons/all';
import { FC, memo } from 'react';
import './style.scss';
import ProfileStatus from '../../molecules/profileStatus';

const brandIcon = require('../../../assets/brandIcon.png');

interface NavbarProps {
  isAuthenticated: boolean;
  onSignIn: () => any;
  onSignOut: () => any;
}

const Navbar: FC<NavbarProps> = ({ isAuthenticated, onSignIn, onSignOut }) => {
  const { t } = useTranslation();

  return (
    <BaseNavbar expand="lg" bg="primary" variant="dark" sticky="top">
      <Container style={{ padding: 0 }}>
        <NavbarBrand href="#/">
          <Image src={brandIcon} height={30} className="d-inline-block" />{' '}
          Toucan
        </NavbarBrand>

        <NavItem>
          <NavLink
            to="/tournaments"
            className="nav-link"
            activeClassName="active"
          >
            <GiBrutalHelm />
            {t('pageName.tournaments')}
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/tasks" className="nav-link" activeClassName="active">
            <GiArcheryTarget />
            {t('pageName.tasks')}
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            to="/submissions"
            className="nav-link"
            activeClassName="active"
          >
            <GiPaperPlane />
            {t('pageName.submissions')}
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            to="/profile/my"
            className="nav-link"
            activeClassName="active"
          >
            <FiUser />
            {t('pageName.profile')}
          </NavLink>
        </NavItem>
        <Nav className="mr-auto" />
        <Nav.Item>
          <ProfileStatus
            isAuthenticated={isAuthenticated}
            signIn={onSignIn}
            signOut={onSignOut}
          />
        </Nav.Item>
      </Container>
    </BaseNavbar>
  );
};

export default memo(Navbar);
