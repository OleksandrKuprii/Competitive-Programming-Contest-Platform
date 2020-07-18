// grid.tsx - provides grid
// implemented using Flexbox.

import styled, { css } from 'styled-components';
import padding, { PaddingProps } from '~/mixins/padding';
import resizable, { ResizableProps } from '~/mixins/resizable';

// Firstly, define basic flex mappings to react

export enum JustifyContent {
  Center        = "center",
  SpaceBetween  = "space-between",
  SpaceAround   = "space-around",
  FlexStart     = "flex-start",
  FlexEnd       = "flex-end",
}

export enum FlexDirection {
  Column = "column",
  Row    = "row"
}

export enum AlignItems {
  Center = "center",
}

export interface FlexProps extends ResizableProps {
  justifyContent?: JustifyContent;
  direction?: FlexDirection;
  alignItems?: AlignItems;
}

export const Flex = styled.div<FlexProps>`
  display: flex;

  justify-content: ${props => props.justifyContent};
  flex-direction: ${props => props.direction};
  align-items: ${props => props.alignItems};

  ${resizable};
`;

// Row is default flex,
// Grid is column directed flex.

export const Row = Flex;

export const Grid = (() => {
  const grid = styled(Flex)``;

  grid.defaultProps = ({
    direction: FlexDirection.Column,
  });

  return grid;
})();

// Col's size is controlled by props
// (default is 1).
// By default has Normal padding.

interface ColProps extends PaddingProps {
  size?: number;
}

export const Col = styled.div<ColProps>`
  flex: ${props => props.size};

  ${padding};
`;

