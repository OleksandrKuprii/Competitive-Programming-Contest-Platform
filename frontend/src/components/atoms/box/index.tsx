import styled, { css } from 'styled-components';
import { color } from '~/theme';

export const Box = styled.div<{ padding?: number }>`
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding}px;
    `}
  box-shadow: 2px 2px 2px 2px #000;
`;

export const ColoredBox = styled(Box)<{ variant?: string }>`
  background-color: ${color};
`;
