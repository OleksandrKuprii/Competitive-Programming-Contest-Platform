import * as React from 'react';
import styled from "styled-components";
import Box from "@/toucanui/atoms/box";
import {FC} from "react";
import {Caption, Subtitle, Title} from "@/toucanui/atoms/typography";
import padding, {Padding} from "~/mixins/padding";
import {background, foreground} from "~/mixins/color";

interface AlertContainerProps {
  variant?: string;
  padding?: Padding;
}

const AlertContainer = styled.div<AlertContainerProps>`
  border-left: ${background} 4px solid;

  ${padding};
  
  margin-bottom: ${Padding.Normal}px;
`;

interface AlertProps {
  title: string;
  subtitle?: string;
  variant?: string;
}

const Alert: FC<AlertProps> = ({ title, subtitle, variant }) => (
  <AlertContainer padding={Padding.Normal} variant={variant}>
    <Title>{title}</Title>
    <Caption>{subtitle}</Caption>
  </AlertContainer>
);

export default Alert;
