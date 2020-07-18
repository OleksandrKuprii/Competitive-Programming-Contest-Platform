

import * as React from 'react';
import styled from "styled-components";
import Box from "@/toucanui/atoms/box";
import {FC, ReactNode} from "react";
import {Caption, Subtitle, Subtitle2, Title} from "@/toucanui/atoms/typography";
import {Padding} from "~/mixins/padding";
import Spacer from "@/toucanui/atoms/spacer";

const BottomAlertContainer = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  
  opacity: 0.9;
  
  transition: opacity 0.1s ease-in-out;
  
  &:hover {
    opacity: 0.95;
  }
`;

interface BottomAlertProps {
  variant: string;
  title?: string;
  subtitle?: string;
  body: ReactNode;
}

const BottomAlert: FC<BottomAlertProps> = ({ variant, title, subtitle, body }) => (
  <BottomAlertContainer variant={variant} padding={Padding.Large} style={{ paddingLeft: '20vw' }}>
    {title && <Title>{title}</Title>}
    {subtitle && <Caption>{subtitle}</Caption>}

    {(title || subtitle) && <Spacer top={Padding.Medium} />}

    {body}
  </BottomAlertContainer>
);

export default BottomAlert;
