import * as React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from "@/toucanui/atoms/loading";

interface ResultProps {
  points: number;
  status: string[];
}

const Result: FC<ResultProps> = ({ points, status }) => {
  const { t } = useTranslation();

  if (status.length === 0) {
    return <></>;
  }

  if (status[0] === 'Running') {
    return (
      <span>
        {t('running')} <Loading />
      </span>
    );
  }

  const started = points >= 0;
  const correct = status[0] === 'Correct';

  if (started) {
    let color;

    if (correct) {
      color = 'success';
    } else {
      color = points === 0 ? 'danger' : 'warning';
    }

    return (
      <p>
        {points} {status.join(', ')}
      </p>
    );
  }

  return <>{status.join(', ')}</>;
};

export default React.memo(Result);
