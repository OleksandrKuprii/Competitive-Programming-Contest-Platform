import * as React from 'react';

const MyResult = (props: { points: number }) => {
  const { points } = props;
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
