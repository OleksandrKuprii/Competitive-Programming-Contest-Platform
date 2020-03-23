import * as React from 'react';
import SubmissionList from '../components/SubmissionList';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';


const SubmissionPage = () => {
    const { t } = useTranslation();

    const submissions = useStoreState(state => state.submissions)

    return (
        <>
            <h1>{t('pagename.submissions')}</h1>

            <p>{t('submissionPage.description')}</p>

            <SubmissionList submissions={submissions}/>
        </>
    );
};

export default SubmissionPage;