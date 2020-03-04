import * as React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Homepage = () => {
    const { t } = useTranslation();

    return (
        <>
            <Jumbotron>
                <p className="h1">{t('homepage:welcome')}</p>
                <p className="lead">{t('homepage:description')}</p>
                <p>
                    <Button variant="primary">{t('learnmore')}</Button>
                </p>
            </Jumbotron>
        </>
    )
};

export default Homepage;