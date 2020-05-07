import * as React from 'react';
import { FC, ReactNode } from 'react';

interface WithLoadingStatusProps {
  children: ReactNode;
  loading: boolean;
  loadingNode: ReactNode;
}

const WithLoading: FC<WithLoadingStatusProps> = ({
  children,
  loading,
  loadingNode,
}) => {
  if (loading) {
    return <>{loadingNode}</>;
  }

  return <>{children}</>;
};

export default WithLoading;
