// shadow.ts - provides material shadows
// used for boxes and other non-div elements
// to focus attention

import { css } from 'styled-components';

// Just normal shadow
// Nothing really special

export const normalShadow = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;


export const majorFocusShadow = css`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`
