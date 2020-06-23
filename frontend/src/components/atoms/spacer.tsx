// spacer.tsx - provides spacer

import styled from 'styled-components';
import {Padding} from "~/mixins/padding";

interface SpacerProps {
  left?: Padding;
  right?: Padding;
  top?: Padding;
  bottom?: Padding;
}

const Spacer = styled.div<SpacerProps>`
  padding-left: ${props => props.left}px;
  padding-right: ${props => props.right}px;
  padding-top: ${props => props.top}px;
  padding-bottom: ${props => props.bottom}px;
`;

export default Spacer;
