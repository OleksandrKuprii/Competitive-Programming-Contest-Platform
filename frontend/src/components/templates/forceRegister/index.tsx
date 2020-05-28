import * as React from 'react';
import { useStoreState } from '~/hooks/store';
import { FC, memo, ReactNode } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

interface ForceRegisterProps {
  children: ReactNode;
}

const ForceRegister: FC<ForceRegisterProps> = ({ children }) => {
  const history = useHistory();

  const { pathname } = history.location;

  console.log(pathname)

  const registered = useStoreState(
    (state) => state.user.myProfileMeta?.registered,
  );

  if (pathname !== '/register' && registered === false) {
    return <Redirect to="/register" />;
  }

  return <>{children}</>;
};

export default memo(ForceRegister);
