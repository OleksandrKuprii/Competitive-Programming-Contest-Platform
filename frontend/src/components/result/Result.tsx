import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Result = ({
  points,
  status,
}: {
  points: number | undefined;
  status?: string[];
}) => {
  const { t } = useTranslation();

  if (!status || status.length === 0) {
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

  const started = points === undefined || points == null ? false : points >= 0;
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
        {points === undefined ? '' : points.toString()} {status.join(', ')}
      </span>
    );
  }

  return <>{status.join(', ')}</>;
};

export default React.memo(Result);
