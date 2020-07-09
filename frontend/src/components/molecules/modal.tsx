import * as React from 'react';
import {FC, ReactNode} from 'react';
import styled, {css} from "styled-components";
import Box from "@/atoms/box";
import Fade from "@/animations/fade";
import {TextAlign, Title} from "@/atoms/typography";
import {Padding} from "~/mixins/padding";
import {majorFocusShadow} from "~/mixins/shadow";
import Spacer from "@/atoms/spacer";
import HorizontalRule from "@/atoms/horizontalRule";
import Button from "@/atoms/button";
import {MdClose} from "react-icons/all";
import {AlignItems, Row} from "@/atoms/grid";

interface ModalContainerProps {
  active: boolean;
}

const ModalContainer = styled(Box)<ModalContainerProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, -50%);
  
  z-index: 9999;
  width: 40vw;
  height: 50vh;
  
  ${props => !props.active && css`
    display: none;
  `};
  
  border-radius: 5px;
  
  overflow: hidden;
  
  ${majorFocusShadow};
`;

const Dimmer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  
  background: #12121288;
`

interface ModalProps {
  children: ReactNode;
  title: string;
}

const Modal: FC<ModalContainerProps & ModalProps> = ({active, children, title}) => (
  <Fade in={active}>
    <Dimmer/>
    <ModalContainer active={active}>
      <Box padding={Padding.Medium}>
        <Row alignItems={AlignItems.Center}>
          <Title>{title}</Title>

          <div style={{ margin: 'auto' }}  />

          <Button icon>
            <MdClose/>
          </Button>
        </Row>
      </Box>

      <HorizontalRule />

      <Box padding={Padding.Medium}>
        {children}
      </Box>
    </ModalContainer>
  </Fade>
);

export default Modal;
