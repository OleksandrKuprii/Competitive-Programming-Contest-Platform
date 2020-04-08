import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useStoreState, useStoreActions } from '../../hooks/store';

const ProfileStatus = () => {
  const isLoading = useStoreState((state) => state.auth0.loading.loading);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const doAuth = useStoreActions((actions) => actions.auth0.doAuth);
  const logout = useStoreActions((actions) => actions.auth0.logout);

  const loginCallback = React.useCallback(() => {
    doAuth({});
  }, [doAuth]);

  const logoutCallback = React.useCallback(() => {
    logout();
  }, [logout]);

  if (isLoading) {
    return (<></>);
  }

  return (
    <>
      { isAuthenticated
        ? (
          <Button variant="outline-danger" onClick={logoutCallback}>
            Sign out
          </Button>
        )
        : (
          <Button variant="outline-info" onClick={loginCallback}>
            Sign in
          </Button>
        )}
    </>
  );
};

export default ProfileStatus;
