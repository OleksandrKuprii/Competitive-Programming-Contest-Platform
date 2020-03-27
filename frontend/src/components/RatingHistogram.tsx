import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import uuid from 'react-uuid';
import { TaskRating } from '../models/taskModel';


const RatingHistogram = ({ rating }: { rating: TaskRating }) => (
  <div style={{ height: 25, padding: 3 }}>
    {[{ value: rating.correct_percent, color: 'green', tooltipInfo: '100 points' },
      { value: rating.incorrect_percent, color: 'yellow', tooltipInfo: '0 < x < 100 points' },
      { value: rating.zero_points_percent, color: 'red', tooltipInfo: '0 points' }].map((({ value, color, tooltipInfo }) => (
        <OverlayTrigger
          key={uuid()}
          placement="bottom"
          overlay={(
            <Tooltip id={uuid()}>
              {tooltipInfo}
              {' '}
              |
              {' '}
              {value}
              %
            </Tooltip>
        )}
        >
          <div className={`${color}_background`} style={{ height: '100%', width: `${value}%`, display: 'inline-block' }} />
        </OverlayTrigger>

    )))}
  </div>
);

export default RatingHistogram;
