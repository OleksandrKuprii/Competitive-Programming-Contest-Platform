import styled, { css } from 'styled-components';
import Link from './index';

const BlockLink = styled(Link)<{ padding?: number }>`
  display: block;
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding}px;
    `}
`;

export default BlockLink;
