import React, {FC} from "react";
import {useStoreState} from "~/hooks/store";
import Defined from "@/helpers/defined";
import ProfileInfo from "@/molecules/profileInfo";


const MyProfileInfo: FC = () => {
  const isAutheticated = useStoreState(state => state.auth0.isAuthenticated);

  const myProfile = useStoreState(state => state.user.myProfile);

  if (!isAutheticated) {
    return <ProfileInfo />
  }

  return (
    <Defined value={myProfile}>
      {(user) => <ProfileInfo user={user} />}
    </Defined>
  );
}

export default MyProfileInfo;
