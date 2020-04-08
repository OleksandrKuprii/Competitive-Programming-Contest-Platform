import * as React from 'react';
import { ReactNode } from 'react';
import { useStoreState } from '../../hooks/store';
import TaskLinkByTask from './TaskLinkByTask';

export interface TaskNameLinkByAliasArgs {
  alias: string
  children?: ReactNode
}

const TaskLinkByAlias = ({ alias, children }: TaskNameLinkByAliasArgs) => {
  const task = useStoreState((state) => state.taskSubmission.task.list.find(
    (t: any) => t.alias === alias,
  ));

  if (task === undefined) {
    return <></>;
  }

  return (
    <TaskLinkByTask taskName={task.name || ''} alias={task.alias}>
      {children}
    </TaskLinkByTask>
  );
};

export default TaskLinkByAlias;
