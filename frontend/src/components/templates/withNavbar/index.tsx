import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Container } from '@/atoms/grid';
import Navbar from '@/organisms/navbar';

interface WithNavbarProps {
  children: ReactNode;
  isAuthenticated: boolean;
  onSignIn: () => any;
  onSingOut: () => any;
}

const WithNavbar: FC<WithNavbarProps> = ({
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

export default WithNavbar;
