import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FC } from 'react';

interface ProfileStatusProps {
  isAuthenticated: boolean;
  signOut: () => any;
  signIn: () => any;
}

const ProfileStatus: FC<ProfileStatusProps> = ({
  isAuthenticated,
  signIn,
  signOut,
}) => (
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

export default ProfileStatus;
