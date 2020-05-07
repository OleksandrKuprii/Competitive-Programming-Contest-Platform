import * as React from 'react';
import { Jumbotron, Image, Row, Col } from 'react-bootstrap';
import { FC, memo } from 'react';
import Defined from '../components/atoms/defined';

interface ProfilePageArgs {
  fullname: string;
  username: string;
  picture?: string;
}

const ProfilePage: FC<ProfilePageArgs> = ({ fullname, username, picture }) => {
  return (
    <Jumbotron>
      <Row>
        <Col>
          <p className="h1">{fullname}</p>
          <p className="description">@{username}</p>
        </Col>

        <Defined value={picture}>
          {(definedPicture) => (
            <Col md="auto">
              <Image src={definedPicture} width={100} height={100} />
            </Col>
          )}
        </Defined>
      </Row>
    </Jumbotron>
  );
};

export default memo(ProfilePage);
