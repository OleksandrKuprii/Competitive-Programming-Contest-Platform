// padding.ts - mixin to set padding from props.
// Supports setting default padding value.
// In worst case fallbacks to Normal padding.

import { css } from 'styled-components';

export enum Padding {
  None   = 0,
  Normal = 10,
  Medium = 20,
  Large  = 50,
}

export interface PaddingProps {
  padding?: Padding;
}

export const paddingWithDefault = (defaultPadding?: Padding) => (props: PaddingProps) => {
  const computedPadding = props.padding || defaultPadding;

  return css`
    padding: ${computedPadding === undefined ? Padding.Normal : computedPadding}px;
  `;
};

export default paddingWithDefault(Padding.None);
