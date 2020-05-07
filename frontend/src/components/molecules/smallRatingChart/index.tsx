import * as React from 'react';
import { FC } from 'react';
import { TaskRating } from '../../../models/interfaces';
import getRatingPercentage from '../../../utils/getRatingPercentage';
import SmallRatingChartBar from './bar';

interface SmallRatingChart {
  id: string;
  rating: TaskRating;
}

const SmallRatingChart: FC<SmallRatingChart> = ({ id, rating }) => {
  const { correct, partial, zero } = rating;

  if (correct === 0 && correct === partial && correct === zero) {
    return <></>;
  }

  const {
    correctPercentage,
    partialPercentage,
    zeroPercentage,
  } = getRatingPercentage(rating);

  return (
    <div style={{ height: 20, width: '10vw', padding: 3 }}>
      {[
        {
          number: correct,
          percentage: correctPercentage,
          color: 'success',
        },
        {
          number: partial,
          percentage: partialPercentage,
          color: 'warning',
        },
        {
          number: zero,
          percentage: zeroPercentage,
          color: 'danger',
        },
      ]
        .filter(({ number }) => number !== 0)
        .map(({ percentage, number, color }) => (
          <SmallRatingChartBar
            key={`${id}${color}`}
            id={id}
            percentage={percentage}
            number={number}
            color={color}
          />
        ))}
    </div>
  );
};

export default SmallRatingChart;
