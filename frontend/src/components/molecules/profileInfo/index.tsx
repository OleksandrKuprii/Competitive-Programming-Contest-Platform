import * as React from 'react';
import {FC} from 'react';
import Box from '@/atoms/box';
import ProfileImage from '@/atoms/profileImage';
import {Col, Grid, Row, JustifyContent, AlignItems} from '@/atoms/grid';
import {Text, TextAlign, Title} from '@/atoms/typography';
import User from '~/typings/entities/user';
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";

interface GeneralProfileInfoProps {
  picture?: string;
  fullname?: string;
  username?: string;
}

const GeneralProfileInfo: FC<GeneralProfileInfoProps> = ({picture, fullname, username}) => <Row>
  <ProfileImage src={picture}/>

  {(fullname || username) &&
  <>
    <Spacer left={Padding.Normal}/>

    <Col>
      {fullname && <Title align={TextAlign.Right}>{fullname}</Title>}
      {username && <Text align={TextAlign.Right}>@{username}</Text>}
    </Col>
  </>
  }
</Row>;

interface ProfileInfoProps {
  user?: User;
}

const guestData: GeneralProfileInfoProps = ({
  fullname: 'Guest'
});

const ProfileInfo: FC<ProfileInfoProps> = ({user}) => {
  if (!user) {
    return <GeneralProfileInfo {...guestData} />
  }

  return <GeneralProfileInfo picture={user.picture} fullname={user.fullname} username={user.username}/>
}

export default ProfileInfo;
