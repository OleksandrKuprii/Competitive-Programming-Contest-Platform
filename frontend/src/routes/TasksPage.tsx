import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';
import TaskList from '../components/TaskList';


const TasksPage = () => {
  const { t } = useTranslation();

  const publictasks = useStoreState((state) => state.publictasks);

  return (
    <>
      <h1>{t('pagename.tasks')}</h1>

      <p>{t('taskspage.description')}</p>

      <TaskList tasks={publictasks} />
    </>
  );
};

export default TasksPage;
