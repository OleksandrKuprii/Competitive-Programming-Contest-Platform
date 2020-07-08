import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Transition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: { [key: string]: { opacity: number } } = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

interface FadeProps {
  in: boolean;
  children: ReactNode;
}

const fadeIn = keyframes`
  0% { opacity: 0.3; transform: scaleY(0.97) }
  100% { opacity: 1; }
`;

const FadeInElem = styled.div`
  animation: 0.5s ease-in-out ${fadeIn};
`;

const Fade: FC<FadeProps> = ({ in: inProp, children }) => (
  <Transition in={inProp} timeout={duration} unmountOnExit>
    {(state) => (
      <FadeInElem
        style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}
      >
        {children}
      </FadeInElem>
    )}
  </Transition>
);

export default Fade;
