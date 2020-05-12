import * as React from 'react';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskDescriptionSection } from '~/typings/entities/task';

interface TaskDescriptionSectionsProps {
  children: (sections: TaskDescriptionSection[]) => ReactNode;
  task: Task;
}

const TaskDescriptionSections: FC<TaskDescriptionSectionsProps> = ({
  children,
  task,
}) => {
  const { t } = useTranslation();

  const sections: TaskDescriptionSection[] = [
    { id: 1, text: task.description?.main },
    {
      id: 2,
      header: t('taskPage.description.inputFormat'),
      text: task.description?.inputFormat,
    },
    {
      id: 3,
      header: t('taskPage.description.outputFormat'),
      text: task.description?.outputFormat,
    },
  ];

  if (task.customSections) {
    task.customSections.forEach((section, i) => {
      sections.push({
        id: 4 + i,
        header: section.name,
        text: section.data,
      });
    });
  }

  return <>{children(sections)}</>;
};

export default TaskDescriptionSections;
