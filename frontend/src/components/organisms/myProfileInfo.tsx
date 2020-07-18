import React, {FC} from "react";
import {useStoreState} from "~/hooks/store";
import ProfileInfo from "@/molecules/profileInfo";


const MyProfileInfo: FC = () => {
  const isAutheticated = useStoreState(state => state.auth0.isAuthenticated);

  const myProfile = useStoreState(state => state.user.myProfile);

  if (!isAutheticated) {
    return <ProfileInfo/>
  }

  return (
    <>
      {myProfile && <ProfileInfo user={myProfile}/>}
    </>
  );
}

export default MyProfileInfo;
