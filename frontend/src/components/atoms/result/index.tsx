import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

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
      <>
        <span className="disabled">
          {t('running')} <Spinner animation="border" size="sm" />
        </span>
      </>
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
      <span className={`text-${color}`}>
        {points.toString()} {status.join(', ')}
      </span>
    );
  }

  return <>{status.join(', ')}</>;
};

export default React.memo(Result);
