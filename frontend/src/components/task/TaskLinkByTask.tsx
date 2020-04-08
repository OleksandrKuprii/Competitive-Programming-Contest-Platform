import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

export interface TaskLinkByTaskArgs {
  taskName: string,
  alias: string
  children?: ReactNode
}

const TaskLinkByTask = ({ alias, taskName, children }: TaskLinkByTaskArgs) => (
  <Link to={`/task/view/${alias}`}>
    {children === undefined
      ? taskName
      : children}
  </Link>
);

export default TaskLinkByTask;
