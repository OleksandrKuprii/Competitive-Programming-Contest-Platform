import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MdReportProblem } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ErrorPage = ({ code }: { code: 'notFound' | 'pleaseSignIn' }) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="display-1 text-center text-danger">
        <MdReportProblem />
      </p>
      <p className="h4 text-center font-weight-bold"> {t(`errorMessages.${code}`)}</p>

      <p className="text-center">
        <Link to="/">{t('goHome')}</Link>
      </p>
    </>
  );
};

export default ErrorPage;
