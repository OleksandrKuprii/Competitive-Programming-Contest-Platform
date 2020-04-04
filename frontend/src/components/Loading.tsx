import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="display-1 text-center">
        <Spinner animation="border" />
      </div>
      <p className="h6 text-center p-3">
        {t('loading')}
        ...
      </p>
    </>
  );
};

export default Loading;
