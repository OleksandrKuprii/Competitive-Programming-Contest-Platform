import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/task/TaskList';
import Loading from '../components/Loading';


const TasksPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);
  const tasks = useStoreState((state) => state.taskSubmission.task.list);
  const tasksLoading = useStoreState((state) => state.taskSubmission.task.loading.loading);
  const authLoading = useStoreState((state) => state.auth0.loading.loading);

  const fetchTasks = useStoreActions((actions) => actions.taskSubmission.fetchTasks);

  React.useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !token) {
      fetchTasks({});
      return;
    }

    fetchTasks({ token });
  }, [fetchTasks, isAuthenticated, token, authLoading]);

  if (tasksLoading || authLoading) {
    return (
      <Loading />
    );
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
