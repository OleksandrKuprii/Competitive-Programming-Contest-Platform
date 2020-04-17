import * as React from 'react';
import { ReactNode } from 'react';
import { useStoreState } from '../../hooks/store';
import TaskLinkByTask from './TaskLinkByTask';

export interface TaskNameLinkByAliasArgs {
  id?: string;
  children?: ReactNode;
}

const TaskLinkByAlias = ({ id, children }: TaskNameLinkByAliasArgs) => {
  const task = useStoreState((state) => (id ? state.task.byId(id) : undefined));

  if (task === undefined) {
    return <></>;
  }

  return (
    <TaskLinkByTask taskName={task.name || ''} id={task.id}>
      {children}
    </TaskLinkByTask>
  );
};

export default TaskLinkByAlias;
