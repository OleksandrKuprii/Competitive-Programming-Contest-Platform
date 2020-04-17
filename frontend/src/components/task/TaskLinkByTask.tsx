import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

export interface TaskLinkByTaskArgs {
  taskName?: string;
  id: string;
  children?: ReactNode;
}

const TaskLinkByTask = ({ id, taskName, children }: TaskLinkByTaskArgs) => (
  <Link to={`/task/view/${id}`}>{children === undefined ? taskName : children}</Link>
);

export default TaskLinkByTask;
