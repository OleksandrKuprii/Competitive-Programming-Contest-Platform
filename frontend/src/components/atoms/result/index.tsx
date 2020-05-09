import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import Loading from '../loading';
import Colored from '../typography/Colored';

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
      <Colored variant={color}>
        {points} {status.join(', ')}
      </Colored>
    );
  }

  return <>{status.join(', ')}</>;
};

export default React.memo(Result);
