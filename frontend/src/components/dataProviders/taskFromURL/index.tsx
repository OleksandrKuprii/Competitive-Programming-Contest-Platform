import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../../../models/interfaces';
import ErrorPage from '../../../pages/ErrorPage';

interface TaskFromURLProps {
  children: (task: Task) => ReactNode;
  tasks: Task[];
  fetchTask: (id: string) => any;
}

const TaskFromURL: FC<TaskFromURLProps> = ({ children, tasks, fetchTask }) => {
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    fetchTask(id);
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
