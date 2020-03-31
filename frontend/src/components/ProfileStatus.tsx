import * as React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useStoreState, useStoreActions } from '../hooks/store';

const ProfileStatus = () => {
  const isLoading = useStoreState((state) => state.auth0.loading);

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  const userPicture = useStoreState((state) => state.auth0.userPicture);
  const username = useStoreState((state) => state.auth0.username);

  const doAuth = useStoreActions((actions) => actions.auth0.doAuth);
  const logout = useStoreActions((actions) => actions.auth0.logout);

  const loginCallback = React.useCallback(() => {
    doAuth();
  }, [doAuth]);

  const logoutCallback = React.useCallback(() => {
    logout();
  }, [logout]);

  if (isLoading) {
    return (<></>);
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={loginCallback}>
        Sign in
      </Button>
    );
  }

  return (
    <>
      Logged in as
      {username}
      .
      <Button variant="link" onClick={logoutCallback}>Log out</Button>
      <div style={{ paddingLeft: 20 }} />
      <Image width={40} height={40} src={userPicture} roundedCircle />
    </>
  );
};

export default ProfileStatus;
