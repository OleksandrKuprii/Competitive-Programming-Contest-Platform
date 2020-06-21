// box.tsx - provides container

import styled from 'styled-components';

import { background, foreground } from '~/mixins/color';
import padding, { PaddingProps } from '~/mixins/padding';
import resizable, { ResizableProps } from '~/mixins/resizable';

export interface BoxProps extends ResizableProps, PaddingProps {
  variant?: string;
}

const Box = styled.div<BoxProps>`
  background: ${background};
  color: ${foreground};

  ${padding};
  ${resizable};
`;

export default Box;
