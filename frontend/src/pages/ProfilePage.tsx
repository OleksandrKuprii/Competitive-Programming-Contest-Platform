import * as React from 'react';
import { FC, memo } from 'react';
import { Col, Row } from '@/atoms/grid';
import Defined from '@/helpers/defined';

interface ProfilePageArgs {
  fullname: string;
  username: string;
  picture?: string;
}

const ProfilePage: FC<ProfilePageArgs> = ({ fullname, username, picture }) => {
  return (
    <div>
      <Row>
        <Col>
          <p className="h1">{fullname}</p>
          <p className="description">@{username}</p>
        </Col>

        <Defined value={picture}>
          {(definedPicture) => (
            <Col>
              <img
                alt="Profile"
                src={definedPicture}
                width={100}
                height={100}
              />
            </Col>
          )}
        </Defined>
      </Row>
    </div>
  );
};

export default memo(ProfilePage);
