import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useStoreState, useStoreActions } from '../../hooks/store';

const ProfileStatus = () => {
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const signIn = useStoreActions((actions) => actions.auth0.signIn);
  const signOut = useStoreActions((actions) => actions.auth0.signOut);

  return (
    <>
      {isAuthenticated ? (
        <Button variant="outline-danger" onClick={() => signOut()}>
          Sign out
        </Button>
      ) : (
        <Button variant="outline-info" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </>
  );
};

export default ProfileStatus;
