import * as React from 'react';

interface SmallRatingChartBarProps {
  percentage: number;
  number: number;
  color: string;
  id: any;
}

const SmallRatingChartBar: React.FC<SmallRatingChartBarProps> = ({
  percentage,
  color,
  // number,
  // id,
}) => {
  return (
    // <OverlayTrigger
    //   placement="bottom"
    //   overlay={<Tooltip id={`${id}${color}`}>{number}</Tooltip>}
    // >
    <div
      className={`bg-${color} task-rating-histogram-bar`}
      style={{
        width: `${percentage}%`,
      }}
    />
    // </OverlayTrigger>
  );
};

export default SmallRatingChartBar;
