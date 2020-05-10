import styled, { css } from 'styled-components';
import Link from '@/atoms/link';

const BlockLink = styled(Link)<{ padding?: number }>`
  display: block;
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding}px;
    `}
`;

export default BlockLink;
