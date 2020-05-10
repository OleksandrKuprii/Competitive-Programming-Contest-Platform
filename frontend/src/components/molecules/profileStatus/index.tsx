import * as React from 'react';
import { FC } from 'react';
import Button from '@/atoms/button';

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
      <Button onClick={() => signOut()}>Sign out</Button>
    ) : (
      <Button onClick={() => signIn()}>Sign in</Button>
    )}
  </>
);

export default ProfileStatus;
