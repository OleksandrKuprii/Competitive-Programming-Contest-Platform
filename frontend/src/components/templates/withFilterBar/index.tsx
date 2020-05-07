import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Row } from 'react-bootstrap';

export interface WithFilterBarProps {
  children: ReactNode;
  filters: ReactNode;
}

const WithFilterBar: FC<WithFilterBarProps> = ({ filters, children }) => {
  return (
    <div>
      <Row style={{ paddingBottom: 20 }}>{filters}</Row>
      <Row>{children}</Row>
    </div>
  );
};

export default WithFilterBar;
