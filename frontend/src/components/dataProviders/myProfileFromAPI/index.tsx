import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import Defined from '@/helpers/defined';
import { User } from '~/models/interfaces';

interface MyProfileFromAPI {
  fetchMyProfile: () => any;
  myProfile?: User;
  children: (myProfile: User) => ReactNode;
}

const MyProfileFromAPI: FC<MyProfileFromAPI> = ({
  fetchMyProfile,
  myProfile,
  children,
}) => {
  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  return (
    <Defined value={myProfile}>
      {(definedProfile) => <>{children(definedProfile)}</>}
    </Defined>
  );
};

export default MyProfileFromAPI;
