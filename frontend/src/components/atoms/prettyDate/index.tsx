import * as React from 'react';
import moment from 'moment';
import { FC } from 'react';

interface PrettyDateProps {
  timestamp?: Date;
}

const PrettyDate: FC<PrettyDateProps> = ({ timestamp }) => {
  return <>{moment(timestamp).fromNow()}</>;
};

export default React.memo(PrettyDate);
