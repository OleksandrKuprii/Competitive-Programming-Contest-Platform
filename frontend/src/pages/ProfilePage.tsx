import * as React from 'react';
import { FC, memo } from 'react';
import ProfileInfo from '@/molecules/profileInfo';
import { Col, Grid, Row } from '@/atoms/grid';
import Box from '@/atoms/box';
import PrettyDate from '@/atoms/prettyDate';
import { Spacer } from '@/atoms/spacers';
import User from '~/typings/entities/user';

interface ProfilePageArgs {
  user: User;
}

const ProfilePage: FC<ProfilePageArgs> = ({ user }) => {
  return (
    <Grid>
      <Row>
        <Col>
          <ProfileInfo user={user} />
        </Col>
      </Row>
      <Spacer />
      <Row>
        <Col>
          <Box padding={20}>
            <b>Signed up:</b> <PrettyDate timestamp={user.signupDate} />
          </Box>
        </Col>
      </Row>
    </Grid>
  );
};

export default memo(ProfilePage);
