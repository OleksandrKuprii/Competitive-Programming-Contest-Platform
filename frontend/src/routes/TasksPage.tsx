import * as React from 'react';
import TaskList from '../components/TaskList';
import { useTranslation } from 'react-i18next';


const TasksPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <h1>{t('pagename.tasks')}</h1>

            <p>{t('taskspage.description')}</p>

            <TaskList tasks={[{ taskName: 'BFS', category: 'Graphs', difficulty: 3, myresult: 100, rating: { correct_percent: 60, incorrect_percent: 10, zero_points_percent: 30 } },
            { taskName: 'Hren na strukturu', category: 'Sishniki', difficulty: 8, myresult: -1, rating: { correct_percent: 20, incorrect_percent: 70, zero_points_percent: 10 } },
            { taskName: 'DIO', category: 'Anime', difficulty: 5, myresult: 40, rating: { correct_percent: 50, incorrect_percent: 30, zero_points_percent: 20 } }]}></TaskList>
        </>
    );
};

export default TasksPage;