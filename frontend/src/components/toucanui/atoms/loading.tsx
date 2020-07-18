import * as React from 'react';
import { FC, memo } from 'react';
import { CircleLoader, SyncLoader } from 'react-spinners';

interface LoadingProps {
  variant?: 'running' | 'loading';
  size?: any;
}

const Loading: FC<LoadingProps> = ({ variant, size }) => {
  if (variant === undefined || variant === 'loading') {
    return <CircleLoader color="white" size={size} />;
  }

  return <SyncLoader color="white" size={size} />;
};

export default memo(Loading);
