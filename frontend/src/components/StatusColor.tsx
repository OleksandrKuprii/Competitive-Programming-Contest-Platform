import * as React from 'react';

const StatusColor = ({ points, status }: { points: string, status: string }) => {
  if (points === '-') {
    return (
      <p className="gray_color" style={{ padding: 0, margin: 0 }}>{status}</p>
    );
  }

  const pointsNum = parseInt(points, 4);
  const started = pointsNum >= 0;
  const correct = pointsNum === 100;

  if (started) {
    let color = null;

    if (correct) {
      color = 'green';
    } else {
      color = (pointsNum === 0 ? 'red' : 'yellow');
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
