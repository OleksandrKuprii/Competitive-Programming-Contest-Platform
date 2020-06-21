// resazable.ts - allows to resize component
// using height and width props.
// Supports setting default size.

import { css } from 'styled-components';

export interface ResizableProps {
  height?: string;
  width?: string;
}

export const resizableWithDefault =
  (defaultWidth?: string, defaultHeight?: string) =>
    ({ height, width }: ResizableProps) => css`
      height: ${height || defaultHeight};
      width: ${width || defaultWidth};
    `;

export default resizableWithDefault();
