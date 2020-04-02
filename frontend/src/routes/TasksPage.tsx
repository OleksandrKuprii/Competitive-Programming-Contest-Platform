import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState, useStoreActions } from '../hooks/store';
import TaskList from '../components/TaskList';


const TasksPage = () => {
  const { t } = useTranslation();

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const idTokenClaims = useStoreState((state) => state.auth0.idTokenClaims);
  const tasks = useStoreState((state) => state.taskSubmission.task.list);

  const fetchTasks = useStoreActions((actions) => actions.taskSubmission.fetchTasks);

  React.useEffect(() => {
    if (!isAuthenticated || !idTokenClaims) {
      fetchTasks({});
      return;
    }

    // eslint-disable-next-line
    fetchTasks({ token: idTokenClaims.__raw });
  }, [fetchTasks, isAuthenticated, idTokenClaims]);

  return (
    <>
      <h1>{t('pageName.tasks')}</h1>

      <p>{t('tasksPage.description')}</p>

      <TaskList tasks={tasks} />
    </>
  );
};

export default TasksPage;
