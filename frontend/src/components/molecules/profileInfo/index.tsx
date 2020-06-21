import * as React from 'react';
import { FC } from 'react';
import Box from '@/atoms/box';
import ProfileImage from '@/atoms/profileImage';
import { Col, Grid, Row, JustifyContent } from '@/atoms/grid';
import { Text, Title } from '@/atoms/typography';
import User from '~/typings/entities/user';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => (
  <Box padding={40}>
    <Row>
      <ProfileImage src={user.picture} />
      <Col>
        <Grid justifyContent={JustifyContent.Center}>
          <Title>{user.fullname}</Title>
          <Text>@{user.username}</Text>
        </Grid>
      </Col>
    </Row>
  </Box>
);

export default ProfileInfo;
