import * as React from 'react';
import {FC, ReactNode} from 'react';
import styled, {css, keyframes} from "styled-components";
import Box from "@/atoms/box";
import Fade from "@/animations/fade";
import {TextAlign, Title} from "@/atoms/typography";
import {Padding} from "~/mixins/padding";
import {majorFocusShadow} from "~/mixins/shadow";
import Spacer from "@/atoms/spacer";
import HorizontalRule from "@/atoms/horizontalRule";
import Button from "@/atoms/button";
import {MdClose} from "react-icons/all";
import {AlignItems, Grid, Row} from "@/atoms/grid";
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

const ModalContainer = styled(Box)`
  position: fixed;
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, -50%);
  
  z-index: 9999;
  
  width: 800px;
  
  border-radius: 5px;
  
  overflow: hidden;
  
  ${majorFocusShadow};
  
  animation: 0.3s ease-out ${appear};
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
}


interface ModalProps {
  children: ReactNode;
  title: string;

  onClose: () => any;

  additionalActions?: ModalAction[];
}

const Modal: FC<ModalProps> = ({children, title, onClose, additionalActions}) => {
  const escPressed = useKeyPressed('Escape');

  if (escPressed) {
    onClose();
  }

  return (
    <>
      <Dimmer onClick={onClose} />
      <ModalContainer>
        <Grid style={{height: 400}}>
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
              {additionalActions && additionalActions.map(({onClick, label, variant}) => (
                <>
                  <Button variant={variant} onClick={onClick} key={label}>{label}</Button>
                  <Spacer left={Padding.Normal}/>
                </>
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
