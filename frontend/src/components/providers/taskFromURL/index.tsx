import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '~/pages/ErrorPage';
import { useStoreActions, useStoreState } from '~/hooks/store';
import { Task } from '~/typings/entities/task';

interface TaskFromURLProps {
  children: (task: Task) => ReactNode;
}

const TaskFromURL: FC<TaskFromURLProps> = ({ children }) => {
  const { id } = useParams();

  const tasks = useStoreState((state) => state.task.tasks);
  const fetchTask = useStoreActions((actions) => actions.task.fetch);

  useEffect(() => {
    if (!id) return;

    fetchTask({ id }).then();
  }, [id, fetchTask]);

  if (!id) {
    return <ErrorPage code="notFound" />;
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return <ErrorPage code="notFound" />;
  }

  return <>{children(task)}</>;
};

export default TaskFromURL;
