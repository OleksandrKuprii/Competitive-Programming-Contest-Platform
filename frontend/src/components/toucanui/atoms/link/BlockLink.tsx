import styled, { css } from 'styled-components';
import Link from '@/toucanui/atoms/link/index';

const BlockLink = styled(Link)<{ padding?: number }>`
  display: block;
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding}px;
    `};
`;

export default BlockLink;
