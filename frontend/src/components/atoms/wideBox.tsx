// wideBox.tsx - extends the width of box

import * as React from 'react';
import {CSSProperties, FC, ReactNode} from 'react';

import styled from 'styled-components';
import Box, { BoxProps } from '@/atoms/box';

const Extended = styled(Box)`
  width: 80vw;
`;

const Container = styled.div`
  width: 60vw;
`;

interface WideBoxProps extends BoxProps {
  children: ReactNode;
  style?: CSSProperties;
}

const WideBox: FC<WideBoxProps> = (props) => {
  const { children, style, ...boxProps } = props;

  return (
    <Extended {...boxProps} style={{ overflow: 'auto' }}>
      <Container style={style}>
        {children}
      </Container>
    </Extended>
  );
}

export default WideBox;
