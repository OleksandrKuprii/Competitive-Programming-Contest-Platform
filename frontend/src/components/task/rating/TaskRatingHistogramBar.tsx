import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TaskRatingHistogramBarArgs {
  percentage: number;
  number: number;
  color: string;
  id: any;
}

const TaskRatingHistogramBar: React.FunctionComponent<TaskRatingHistogramBarArgs> = ({
  percentage,
  color,
  number,
  id,
}) => {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${id}${color}`}>{number}</Tooltip>}>
      <div
        className={`bg-${color}`}
        style={{
          height: '100%',
          width: `${percentage}%`,
          display: 'inline-block',
        }}
      />
    </OverlayTrigger>
  );
};

export default TaskRatingHistogramBar;
