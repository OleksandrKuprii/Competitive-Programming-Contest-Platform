import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

interface LoadingArgs {
  variant: 'running' | 'processing' | 'loading';
}

const LoadingSpinner = () => (
  <div className="lds-facebook">
    <div />
    <div />
    <div />
  </div>
);

const ProcessingSpinner = () => (
  <div className="lds-grid">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

const RunningSpinner = () => (
  <div className="lds-ring">
    <div />
    <div />
    <div />
    <div />
  </div>
);

const spinners = {
  running: <RunningSpinner />,
  processing: <ProcessingSpinner />,
  loading: <LoadingSpinner />,
};

const Loading = ({ variant }: LoadingArgs) => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      {spinners[variant]}
      <p className="p-0 font-weight-bold big">
        {t(`preloader.${variant}`)}
        ...
      </p>
    </div>
  );
};

export default memo(Loading);
