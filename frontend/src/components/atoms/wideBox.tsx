// wideBox.tsx - extends the width of box

import * as React from 'react';
import { FC, ReactNode } from 'react';

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
}

const WideBox: FC<WideBoxProps> = (props) => {
  const { children, ...boxProps } = props;

  return (
    <Extended {...boxProps}>
      <Container>
        {children}
      </Container>
    </Extended>
  );
}

export default WideBox;
