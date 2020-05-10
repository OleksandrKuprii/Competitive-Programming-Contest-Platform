import * as React from 'react';
import { FC } from 'react';
import SmallRatingChartBar from '@/atoms/smallRatingChartBar';
import Box from '@/atoms/box';
import ReactTooltip from 'react-tooltip';
import { TaskRating } from '~/models/interfaces';
import getRatingPercentage from '~/utils/getRatingPercentage';

interface SmallRatingChart {
  rating: TaskRating;
}

const SmallRatingChart: FC<SmallRatingChart> = ({ rating }) => {
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
    <Box height="20px" width="10vw">
      <ReactTooltip />

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
        .map(({ percentage, color, number }) => (
          <React.Fragment key={color}>
            <SmallRatingChartBar
              percentage={percentage}
              variant={color}
              data-tip={`${number} - ${percentage}%`}
            />
          </React.Fragment>
        ))}
    </Box>
  );
};

export default SmallRatingChart;
