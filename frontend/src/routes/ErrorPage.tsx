import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBan } from 'react-icons/all';
import { Link } from 'react-router-dom';

const ErrorPage = ({ code }: { code: 'notFound' | 'pleaseSignIn' }) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="display-1 text-center text-danger">
        <FaBan />
      </p>
      <p className="h4 text-center font-weight-bold">
        {' '}
        {t(`errorMessages.${code}`)}
      </p>

      <p className="text-center">
        <Link to="/">
          {t('goHome')}
        </Link>
      </p>
    </>
  );
};

export default ErrorPage;
