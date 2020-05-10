import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Row } from '@/atoms/grid';

export interface WithFilterBarProps {
  children: ReactNode;
  filters: ReactNode;
}

const WithFilterBar: FC<WithFilterBarProps> = ({ filters, children }) => {
  return (
    <div>
      {filters}
      <div style={{ paddingBottom: 20 }} />
      <Row>{children}</Row>
    </div>
  );
};

export default WithFilterBar;
