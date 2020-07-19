import * as React from 'react';
import {FC, ReactNode} from 'react';
import styled, {css, keyframes} from "styled-components";
import Box from "@/toucanui/atoms/box";
import Fade from "@/toucanui/animations/fade";
import {TextAlign, Title} from "@/toucanui/atoms/typography";
import {Padding} from "~/mixins/padding";
import {majorFocusShadow} from "~/mixins/shadow";
import Spacer from "@/toucanui/atoms/spacer";
import HorizontalRule from "@/toucanui/atoms/horizontalRule";
import Button from "@/toucanui/atoms/button";
import {MdClose} from "react-icons/all";
import {AlignItems, Grid, Row} from "@/toucanui/atoms/grid";
import useKeyPressed from "~/hooks/useKeyPressed";

const appear = keyframes`
  from {
    transform: translateX(-50%) translateY(-100%) scale(0.9);
    opacity: 0;
  }
  
  to {
    transform: translateX(-50%) translateY(-50%) scale(1);
    opacity: 1;
  }
`;

const ModalContainer = styled(Box)<{ wide?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, -50%);
  
  z-index: 9999;
  
  width: ${props => props.wide ? 40 : 30}vw;
  
  max-height: 100vh;
  
  border-radius: 5px;
  
  overflow: visible;
  
  ${majorFocusShadow};
  animation: 0.3s ease-out ${appear};
  transition: 0.3s flex ease-in-out;
`;

const Dimmer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  
  background: #12121288;
`;


interface ModalAction {
  onClick: () => any,
  label: string,
  variant: string,
  disabled?: boolean,
}


interface ModalProps {
  children: ReactNode;
  title: string;

  onClose: () => any;

  additionalActions?: ModalAction[];

  wide?: boolean;
}

const Modal: FC<ModalProps> = ({children, title, onClose, additionalActions, wide}) => {
  const escPressed = useKeyPressed('Escape');

  if (escPressed) {
    onClose();
  }

  return (
    <>
      <Dimmer onClick={onClose}/>

      <ModalContainer wide={wide}>
        <Grid>
          <Box style={{padding: `${Padding.Normal}px ${Padding.Medium}px`}}>
            <Row alignItems={AlignItems.Center}>
              <Title>{title}</Title>

              <div style={{margin: 'auto'}}/>
            </Row>
          </Box>

          <HorizontalRule/>

          <Box padding={Padding.Medium}>
            {children}
          </Box>

          <div style={{marginTop: 'auto'}}/>

          <HorizontalRule/>

          <Box padding={Padding.Medium}>
            <Row>
              {additionalActions && additionalActions.map(({onClick, label, variant, disabled }) => (
                <React.Fragment key={label}>
                  <Button variant={variant} onClick={onClick} disabled={disabled}>{label}</Button>
                  <Spacer left={Padding.Normal}/>
                </React.Fragment>
              ))}

              {additionalActions && <div style={{margin: 'auto'}}/>}

              <Button variant="primary" onClick={onClose}>Close</Button>
            </Row>
          </Box>
        </Grid>
      </ModalContainer>
    </>
  );
};

export default Modal;
