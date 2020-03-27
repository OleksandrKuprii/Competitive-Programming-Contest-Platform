import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/TaskList';


const TasksPage = () => {
  const { t } = useTranslation();

  const tasks = useStoreState((state) => state.task.list);

  const fetchTasks = useStoreActions((actions) => actions.task.fetchTasks);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <>
      <h1>{t('pagename.tasks')}</h1>

      <p>{t('taskspage.description')}</p>

      <TaskList tasks={tasks} />
    </>
  );
};

export default TasksPage;
