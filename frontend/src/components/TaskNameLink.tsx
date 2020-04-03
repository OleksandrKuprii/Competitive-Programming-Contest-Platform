import * as React from 'react';
import { Link } from 'react-router-dom';
import { useStoreState } from '../hooks/store';

export interface TaskNameLinkByTaskArgs {
  taskName: string,
  alias: string
}

export interface TaskNameLinkByAliasArgs {
  alias: string
}

export const TaskNameLinkByTask = ({ alias, taskName }: TaskNameLinkByTaskArgs) => (
  <Link to={`/task/view/${alias}`}>{taskName}</Link>
);

export const TaskNameLinkByAlias = ({ alias }: TaskNameLinkByAliasArgs) => {
  const task = useStoreState((state) => state.taskSubmission.task.list.find(
    (t: any) => t.alias === alias,
  ));

  if (task === undefined) {
    return <></>;
  }

  return (
    <TaskNameLinkByTask taskName={task.name} alias={task.alias} />
  );
};
