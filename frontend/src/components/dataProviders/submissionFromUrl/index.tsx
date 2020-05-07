import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Submission } from '../../../models/interfaces';
import ErrorPage from '../../../pages/ErrorPage';

interface SubmissionFromURLProps {
  children: (submission: Submission) => ReactNode;
  submissions: Submission[];
  fetchSubmission: (id: number) => any;
}

const SubmissionFromURL: FC<SubmissionFromURLProps> = ({
  children,
  submissions,
  fetchSubmission,
}) => {
  const { id: idStr } = useParams();

  let id: number | undefined;

  if (idStr) {
    id = parseInt(idStr, 10);
  }

  const submission = submissions.find((s) => s.id === id);

  useEffect(() => {
    if (!id) return;

    fetchSubmission(id);
  }, []);

  if (!submission) {
    return <ErrorPage code="notFound" />;
  }

  return <>{children(submission)}</>;
};

export default SubmissionFromURL;
