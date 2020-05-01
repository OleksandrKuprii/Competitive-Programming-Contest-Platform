import * as React from 'react';
import { Jumbotron } from 'react-bootstrap';

interface ProfilePageArgs {
  username: string;
  fullName: string;
}

const ProfilePage: React.FunctionComponent<ProfilePageArgs> = ({
  username,
  fullName,
}) => {
  return (
    <Jumbotron>
      <p className="h1">{fullName}</p>
      <p className="description">@{username}</p>
    </Jumbotron>
  );
};

export default ProfilePage;
