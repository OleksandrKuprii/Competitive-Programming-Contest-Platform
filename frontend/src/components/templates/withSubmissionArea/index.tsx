import * as React from 'react';
import { FC, ReactNode } from 'react';
import SolutionDropZone from '@/organisms/solutionDropZone';
import SolutionSubmissionForm from '@/organisms/solutionSubmissionForm';

interface WithSubmissionAreaProps {
  children: ReactNode;
  taskId: string;
}

const WithSubmissionArea: FC<WithSubmissionAreaProps> = ({
  children,
  taskId,
}) => (
  <>
    {children}
    <SolutionDropZone>
      <SolutionSubmissionForm taskId={taskId} />
    </SolutionDropZone>
  </>
);

export default WithSubmissionArea;
