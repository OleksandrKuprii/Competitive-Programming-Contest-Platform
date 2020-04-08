import * as React from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Jumbotron } from 'react-bootstrap';
import { useStoreState } from '../../hooks/store';

const guestAvatar = require('../../assets/guestAvatar.png');

const ProfileInfo = () => {
  const authLoading = useStoreState((state) => state.auth0.loading.loading);
  const username = useStoreState((state) => state.auth0.username);
  const userPicture = useStoreState((state) => state.auth0.userPicture);

  if (authLoading) {
    return <></>;
  }

  return (
    <Jumbotron>
      <Row>
        <Col className="text-center">
          <Image src={userPicture || guestAvatar} width={100} rounded />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <p className="h4 m-2">
            {username || 'Guest'}
          </p>
        </Col>
      </Row>
    </Jumbotron>
  );
};

export default ProfileInfo;
