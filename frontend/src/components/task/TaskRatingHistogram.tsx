import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TaskRating } from '../../models/taskModel';


const TaskRatingHistogram = ({ id, rating }: { id: any, rating: TaskRating }) => (
  <div style={{ height: 25, padding: 3 }}>
    {[{ value: rating.correct, color: 'green', tooltipInfo: '100 points' },
      { value: rating.partiallyCorrect, color: 'yellow', tooltipInfo: '0 < x < 100 points' },
      { value: rating.zeroPointAnswer, color: 'red', tooltipInfo: '0 points' }].map((({ value, color, tooltipInfo }) => (
        <OverlayTrigger
          key={`${id}-rating-${value}-${color}`}
          placement="bottom"
          overlay={(
            <Tooltip id={`tooltip-rating-histogram-${id}-rating-${value}-${color}`}>
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

export default TaskRatingHistogram;
