import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '../../organisms/navbar';

interface WithStickyNavbarProps {
  children: ReactNode;
  isAuthenticated: boolean;
  onSignIn: () => any;
  onSingOut: () => any;
}

const WithStickyNavbar: FC<WithStickyNavbarProps> = ({
  children,
  isAuthenticated,
  onSignIn,
  onSingOut,
}) => (
  <>
    <Navbar
      isAuthenticated={isAuthenticated}
      onSignIn={onSignIn}
      onSignOut={onSingOut}
    />

    <Container style={{ padding: 0, marginTop: 20 }}>{children}</Container>
  </>
);

export default WithStickyNavbar;
