import * as React from 'react';
import WithLoading from '@/templates/withLoading';
import Defined from '@/helpers/defined';
import { useStoreState } from '~/hooks/store';
import ProfilePage from '~/pages/ProfilePage';

const MyProfile = () => {
  const myProfile = useStoreState((state) => state.user.myProfile);
  const myProfileLoading = useStoreState((state) => state.user.loadingStatus);

  return (
    <WithLoading loading={myProfileLoading}>
      <Defined value={myProfile}>
        {(profile) => <ProfilePage user={profile} />}
      </Defined>
    </WithLoading>
  );
};

export default MyProfile;
