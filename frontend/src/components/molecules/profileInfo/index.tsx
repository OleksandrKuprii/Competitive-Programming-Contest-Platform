import * as React from 'react';
import {FC} from 'react';
import {Col, Row} from '@/toucanui/atoms/grid';
import {Text, TextAlign, Title} from '@/toucanui/atoms/typography';
import User from '~/typings/entities/user';
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import ProfileImage from "@/toucanui/atoms/profileImage";

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
