// useHasUserPermissions.ts - hook used for checking for user permissions
// user permissions = signed in + registered
// otherwise user has guest permissions

import {useStoreState} from "~/hooks/store";


function useHasUserPermissions() {
  const isAuthenticated = useStoreState(state => state.auth0.isAuthenticated);
  const registered = useStoreState(state => state.user.myProfileMeta?.registered);

  return isAuthenticated && registered;
}

export default useHasUserPermissions;
