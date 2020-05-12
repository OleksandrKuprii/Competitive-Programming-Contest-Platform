import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '~/pages/ErrorPage';
import { useStoreState, useStoreActions } from '~/hooks/store';
import { Submission } from '~/typings/entities/submission';

interface SubmissionFromURLProps {
  children: (submission: Submission) => ReactNode;
}

const SubmissionFromURL: FC<SubmissionFromURLProps> = ({ children }) => {
  const { id: idStr } = useParams();

  const submissions = useStoreState((state) => state.submission.submissions);
  const fetchSubmission = useStoreActions(
    (actions) => actions.submission.fetch,
  );

  let id: number | undefined;

  if (idStr) {
    id = parseInt(idStr, 10);
  }

  const submission = submissions.find((s) => s.id === id);

  useEffect(() => {
    if (!id) return;

    fetchSubmission({ id }).then();
  }, [id, fetchSubmission]);

  if (!submission) {
    return <ErrorPage code="notFound" />;
  }

  return <>{children(submission)}</>;
};

export default SubmissionFromURL;
