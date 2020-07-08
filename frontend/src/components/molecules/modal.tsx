import * as React from 'react';
import styled, {css} from "styled-components";
import Box from "@/atoms/box";

interface ModalProps {
  active: boolean;
}

const Modal = styled(Box)<ModalProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, -50%);
  
  z-index: 9999;
  width: 80vw;
  height: 80vh;
  
  ${props => !props.active && css`
    display: none;
  `}
`;

export default Modal;
