import * as React from 'react';
import { FC, ReactNode } from 'react';

import { Row, Col } from '@/atoms/grid';

import Box from '@/atoms/box';

import { Title } from '@/atoms/typography';

interface SidebarLayout {
  children: ReactNode
  sidebar: ReactNode
}


const SidebarLayout: FC<SidebarLayout> = ({ children, sidebar }) => (
  <Row style={{ height: '100vh' }}>
    <div style={{ minWidth: '20vw', maxWidth: '20vw' }}>
      {sidebar}
    </div>
    <Col style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      {children}
    </Col>
  </Row>
);

export default SidebarLayout;
