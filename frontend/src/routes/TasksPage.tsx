import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import Loading from '../components/Loading';


const TasksPage = () => {
  const { t } = useTranslation();

  const nTasks = useStoreState((state) => state.task.nItems);
  const tasksLoading = useStoreState((state) => state.task.loading.flag);

  const fetchTasks = useStoreActions((actions) => actions.task.fetchRange);

  const tasks = nTasks(50);

  useEffect(() => {
    if (!tasksLoading && tasks.length < 50) {
      fetchTasks({ offset: 0, number: 50 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (tasksLoading) {
    return <Loading />;
  }

  return (
    <>
      <p className="h3 m-0">{t('pageName.tasks')}</p>

      <p className="description">{t('tasksPage.description')}</p>

      <TaskList tasks={tasks} />
    </>
  );
};

export default TasksPage;
