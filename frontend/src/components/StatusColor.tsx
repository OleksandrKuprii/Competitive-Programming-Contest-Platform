import * as React from 'react';
import { Spinner } from 'react-bootstrap';

const StatusColor = ({ points, status }: { points: number, status: string }) => {
  if (points === null) {
    return (
      <p className="gray_color" style={{ padding: 0, margin: 0 }}>
        {status}
        {' '}
        <Spinner animation="border" size="sm" className="gray_color" />
      </p>
    );
  }

  const started = points >= 0;
  const correct = points === 100;

  if (started) {
    let color = null;

    if (correct) {
      color = 'green';
    } else {
      color = (points === 0 ? 'red' : 'yellow');
    }

    return (
      <p className={`${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
        {status}
      </p>
    );
  }
  return (<p>{status}</p>);
};

export default StatusColor;
