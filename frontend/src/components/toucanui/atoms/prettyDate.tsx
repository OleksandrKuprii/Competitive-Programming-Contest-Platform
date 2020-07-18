import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';

interface PrettyDateProps {
  timestamp?: Date;
}

const PrettyDate: FC<PrettyDateProps> = ({ timestamp }) => {
  return <>{moment(timestamp).fromNow()}</>;
};

export default React.memo(PrettyDate);
