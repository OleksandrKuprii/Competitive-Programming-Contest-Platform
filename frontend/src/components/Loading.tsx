import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <div className="lds-facebook">
        <div />
        <div />
        <div />
      </div>
      <p className="big p-0 font-weight-bold">
        {t('loading')}
        ...
      </p>
    </div>
  );
};

export default memo(Loading);
