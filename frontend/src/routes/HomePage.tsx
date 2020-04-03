import * as React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Jumbotron>
        <p className="h1 m-0">{t('homepage.welcome')}</p>
        <p className="subtitle">{t('homepage.description')}</p>
        <p>
          <Button variant="primary">{t('learnMore')}</Button>
        </p>
      </Jumbotron>
    </>
  );
};

export default Homepage;
