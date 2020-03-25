import { useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface TaskNameLinkByTaskArgs {
  taskName: string,
  alias: string
}

export interface TaskNameLinkByAliasArgs {
  alias: string
}

export const TaskNameLinkByTask = ({ alias, taskName }: TaskNameLinkByTaskArgs) => (
  <Link to={`/task/view/${alias}`} style={{ color: 'white' }}>{taskName}</Link>
);

export const TaskNameLinkByAlias = ({ alias }: TaskNameLinkByAliasArgs) => {
  const { taskName } = useStoreState((state: any) => state.publictasks.find(
    (task: any) => task.alias === alias,
  ));

  return (
    <TaskNameLinkByTask taskName={taskName} alias={alias} />
  );
};
