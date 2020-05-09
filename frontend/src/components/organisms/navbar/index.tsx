import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FC, memo } from 'react';
import styled from 'styled-components';
import ProfileStatus from '../../molecules/profileStatus';
import { Container, Row } from '../../atoms/grid';
import Link from '../../atoms/link';
import { HorizontalSpacer } from '../../atoms/spacers';

const brandIcon = require('../../../assets/brandIcon.png');

interface NavbarProps {
  isAuthenticated: boolean;
  onSignIn: () => any;
  onSignOut: () => any;
}

const StyledNavbar = styled.nav`
  background: ${(props) => props.theme.background};
  font-size: 16px;
  box-shadow: 1px 1px 2px 2px #000;
`;

const Brand = styled(Link)`
  display: block;
`;

const NavLink = styled(Link)`
  padding: 15px;
  transition: all 0.2s ease-in-out;
`;

const Navbar: FC<NavbarProps> = ({ isAuthenticated, onSignIn, onSignOut }) => {
  const { t } = useTranslation();

  return (
    <StyledNavbar>
      <Container>
        <Row style={{ padding: '10px 0' }}>
          <Brand href="#/">
            <img src={brandIcon} height={45} alt="Brand logo" />
          </Brand>

          <div style={{ marginRight: 'auto' }} />

          <NavLink href="#/tournaments">{t('pageName.tournaments')}</NavLink>

          <NavLink href="#/tasks">{t('pageName.tasks')}</NavLink>

          <NavLink href="#/submissions">{t('pageName.submissions')}</NavLink>

          <NavLink href="#/profile/my">{t('pageName.profile')}</NavLink>

          <HorizontalSpacer size={10} />

          <ProfileStatus
            isAuthenticated={isAuthenticated}
            signIn={onSignIn}
            signOut={onSignOut}
          />
        </Row>
      </Container>
    </StyledNavbar>
  );
};

export default memo(Navbar);
