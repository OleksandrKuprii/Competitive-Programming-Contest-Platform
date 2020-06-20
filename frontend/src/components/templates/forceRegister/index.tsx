import * as React from 'react';
import { FC, memo, ReactNode } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from '~/hooks/store';

interface ForceRegisterProps {
  children: ReactNode;
}

const ForceRegister: FC<ForceRegisterProps> = ({ children }) => {
  const history = useHistory();

  const { pathname } = history.location;

  const registered = useStoreState(
    (state) => state.user.myProfileMeta?.registered,
  );

  if (pathname !== '/register' && registered === false) {
    return <Redirect to="/register" />;
  }

  return <>{children}</>;
};

export default memo(ForceRegister);
