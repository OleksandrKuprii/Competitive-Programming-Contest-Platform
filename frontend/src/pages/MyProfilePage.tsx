import * as React from 'react';
import WithLoading from '@/templates/withLoading';
import Defined from '@/helpers/defined';
import ProfilePageLayout from '@/templates/profilePageLayout';
import { useStoreState } from '~/hooks/store';

const MyProfilePage = () => {
  const myProfile = useStoreState((state) => state.user.myProfile);
  const myProfileLoading = useStoreState((state) => state.user.loadingStatus);

  return (
    <WithLoading loading={myProfileLoading}>
      <Defined value={myProfile}>
        {(profile) => <ProfilePageLayout user={profile} />}
      </Defined>
    </WithLoading>
  );
};

export default MyProfilePage;
