import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MyResult = ({ points }: { points: number }) => {
  const { t } = useTranslation();

  if (points == null) {
    return (
      <>
        <span className="gray_color">-</span>
      </>);
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
      <p className={`${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
        {points.toString()}
      </p>
    );
  }

  return (
    <>
    </>
  );
};

export default MyResult;
