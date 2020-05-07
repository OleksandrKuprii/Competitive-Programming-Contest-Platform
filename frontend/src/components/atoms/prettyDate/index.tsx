import * as React from 'react';
import moment from 'moment';

const PrettyDate = ({ timestamp }: { timestamp?: Date }) => {
  return <span>{moment(timestamp).fromNow()}</span>;
};

export default React.memo(PrettyDate);
