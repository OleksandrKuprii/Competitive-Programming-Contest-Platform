import * as React from 'react';
import { FC, ReactNode } from 'react';
import LoadingPage from '~/pages/LoadingPage';

interface WithLoadingStatusProps {
  children: ReactNode;
  loading: boolean;
  loadingNode?: ReactNode;
}

const WithLoading: FC<WithLoadingStatusProps> = ({
  children,
  loading,
  loadingNode,
}) => {
  if (loading) {
    return <>{loadingNode || <LoadingPage />}</>;
  }

  return <>{children}</>;
};

export default WithLoading;
