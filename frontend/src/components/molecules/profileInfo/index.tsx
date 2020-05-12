import * as React from 'react';
import { FC } from 'react';
import Box from '@/atoms/box';
import ProfileImage from '@/atoms/profileImage';
import { Col, Grid, Row } from '@/atoms/grid';
import { Paragraph, Title } from '@/atoms/typography';
import User from '~/typings/entities/user';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => (
  <Box padding={40}>
    <Row>
      <ProfileImage src={user.picture} />
      <Col>
        <Grid justifyContent="center">
          <Title>{user.fullname}</Title>
          <Paragraph>@{user.username}</Paragraph>
        </Grid>
      </Col>
    </Row>
  </Box>
);

export default ProfileInfo;
