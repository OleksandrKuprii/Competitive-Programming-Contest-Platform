import * as React from 'react';
import TaskList from '../components/TaskList';
import { useTranslation } from 'react-i18next';


const TasksPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <h1>{t('pagenames:tasks')}</h1>

            <p>{t('taskspage:description')}</p>

            <TaskList tasks={[{ taskName: 'BFS', category: 'Graphs', difficulity: 'Easy', status: 'Didn\'t solved' },
                              { taskName: 'Hren na strukturu', category: 'Sishniki', difficulity: 'Hard', status: 'Solved' },
                              { taskName: 'DIO', category: 'Anime', difficulity: 'JoJo', status: 'Died' }]}></TaskList>
        </>
    );
};

export default TasksPage;