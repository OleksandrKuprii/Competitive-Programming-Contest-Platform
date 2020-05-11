import * as React from 'react';
import { FC, ReactNode } from 'react';
import Defined from '@/helpers/defined';
import WithLoading from '@/templates/withLoading';
import { User } from '~/models/interfaces';
import LoadingPage from '~/pages/LoadingPage';

interface ProfileFromAPIProps {
  profile?: User;
  children: (myProfile: User) => ReactNode;
  loading: boolean;
}

const ProfileFromAPI: FC<ProfileFromAPIProps> = ({
  profile,
  children,
  loading,
}) => (
  <WithLoading loading={loading} loadingNode={<LoadingPage />}>
    <Defined value={profile}>
      {(definedProfile) => <>{children(definedProfile)}</>}
    </Defined>
  </WithLoading>
);

export default ProfileFromAPI;
