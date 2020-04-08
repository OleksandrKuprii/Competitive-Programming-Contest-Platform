import * as React from 'react';
import { useStoreState } from '../../hooks/store';
import { Submission } from '../../models/submissionModel';
import SubmissionLink from '../submission/SubmissionLink';
import Result from './Result';

const GreatestResult = ({ taskAlias }: { taskAlias: string | undefined }) => {
  const submissions = useStoreState((state) => state.taskSubmission.submission.list);

  if (taskAlias === undefined) {
    return <></>;
  }

  const submissionsClone: Array<Submission> = [...submissions];

  submissionsClone.sort((a, b) => {
    if (a.points == null) {
      return 1;
    }

    if (b.points == null) {
      return -1;
    }

    return (a.points > b.points ? -1 : 1);
  });

  const greatestSubmission = submissionsClone.find(
    (submission) => submission.taskAlias === taskAlias,
  );

  if (greatestSubmission === undefined) {
    return <></>;
  }

  return (
    <SubmissionLink id={greatestSubmission.id}>
      <Result points={greatestSubmission.points} status={greatestSubmission.status || []} />
    </SubmissionLink>
  );
};

export default GreatestResult;
