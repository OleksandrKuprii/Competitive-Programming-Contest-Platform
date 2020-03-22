import * as React from 'react';
import TaskList from '../components/TaskList';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';


const TasksPage = () => {
    const { t } = useTranslation();

    const publictasks = useStoreState(state => state.publictasks)

    return (
        <>
            <h1>{t('pagename.tasks')}</h1>

            <p>{t('taskspage.description')}</p>

            <TaskList tasks={publictasks}></TaskList>
        </>
    );
};

export default TasksPage;