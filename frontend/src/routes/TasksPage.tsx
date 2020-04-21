import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import Loading from '../components/Loading';

const TasksPage = () => {
  const { t } = useTranslation();

  const allTasks = useStoreState((state) =>
    state.task.nItemsByCustomKey((item) => item.difficulty),
  );

  const tasksLoading = useStoreState((state) => state.task.loading.flag);

  const fetchTasks = useStoreActions((actions) => actions.task.fetchRange);

  const tasks = allTasks.slice(0, 50);

  useEffect(() => {
    fetchTasks({ offset: 0, number: 50, sortBy: [{ name: 'difficulty' }] });
  }, [fetchTasks]);

  if (tasksLoading) {
    return <Loading variant="loading" />;
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
