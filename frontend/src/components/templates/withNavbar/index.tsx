import * as React from 'react';
import { FC, ReactNode, useCallback } from 'react';
import { Container } from '@/atoms/grid';
import Navbar from '@/organisms/navbar';
import { useStoreState, useStoreActions } from '~/hooks/store';

interface WithNavbarProps {
  children: ReactNode;
}

const WithNavbar: FC<WithNavbarProps> = ({ children }) => {
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const signIn = useStoreActions((state) => state.auth0.signIn);
  const signOut = useStoreActions((state) => state.auth0.signOut);

  const onSignIn = useCallback(() => {
    signIn();
  }, [signIn]);

  const onSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
      />

      <Container style={{ padding: 0, marginTop: 20 }}>{children}</Container>
    </>
  );
};

export default WithNavbar;
