import * as React from 'react';
import { Spinner } from 'react-bootstrap';

const MyResult = ({ points, status }: { points: number, status: string }) => {
  if (points == null) {
    return (
      <>
        <span className="gray_color">
          {status}
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
        {status}
      </span>
    );
  }

  return (
    <>
      {status}
    </>
  );
};

export default MyResult;
