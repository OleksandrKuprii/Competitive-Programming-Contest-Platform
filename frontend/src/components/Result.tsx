import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { Submission } from '../models/submissionModel';

export const Result = (
  { points, status }:
  { points: number | undefined, status: string[] },
) => {
  const { t } = useTranslation();

  if (points === undefined || points === null) {
    return (
      <>
        <span className="gray_color">
          {t('running')}
          {' '}
          <Spinner animation="border" size="sm" />
        </span>
      </>
    );
  }

  const started = points >= 0;
  const correct = points === 100;

  if (started) {
    let color = null;

    if (correct) {
      color = 'green';
    } else {
      color = points === 0 ? 'red' : 'yellow';
    }

    return (
      <span className={`${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
        {points.toString()}
        {' '}
        {status.join(', ')}
      </span>
    );
  }

  return (
    <>
      {status.join(', ')}
    </>
  );
};

export const GreatestResult = ({ taskAlias }: { taskAlias: string | undefined }) => {
  const submissions = useStoreState((state: any) => state.submission.list);

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

  const latestSubmission = submissionsClone.find(
    (submission) => submission.taskAlias === taskAlias,
  );

  return <Result points={latestSubmission?.points} status={latestSubmission?.status || []} />;
};
