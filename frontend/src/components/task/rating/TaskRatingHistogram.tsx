import * as React from 'react';
import { TaskRating } from '../../../models/interfaces';
import getRatingPercentage from '../../../utils/getRatingPercentage';
import TaskRatingHistogramBar from './TaskRatingHistogramBar';

const TaskRatingHistogram = ({ id, rating }: { id: any; rating: TaskRating }) => {
  const { correct, partial, zero } = rating;
  const { correctPercentage, partialPercentage, zeroPercentage } = getRatingPercentage(rating);

  return (
    <div style={{ height: 25, padding: 3 }}>
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
      ].map(({ percentage, number, color }) => (
        <TaskRatingHistogramBar
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

export default TaskRatingHistogram;
