import * as React from 'react';
import styled, {css} from "styled-components";
import {background, foreground, hoverBackground, hoverForeground} from "~/mixins/color";
import {FC, ReactNode} from "react";
import Loading from "@/toucanui/atoms/loading";
import {SyncLoader, ClipLoader} from "react-spinners";
import {AlignItems, Row} from "@/toucanui/atoms/grid";
import {Padding} from "~/mixins/padding";
import Spacer from "@/toucanui/atoms/spacer";


interface ButtonBaseProps {
  icon?: boolean;
  variant?: string;
  disabled?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bolder;
  text-transform: uppercase;
  border-radius: 5px;
  transition: all 0.3s;
  
  ${props => props.icon && css`
    font-size: 18px;
  `};
  
  ${props => !props.disabled ? css`
    background: ${background};
    color: ${foreground};
    
    &:hover {
      background: ${hoverBackground};
      color: ${hoverForeground};
    }
  ` : css`
    background-color: #ccc;
    color: #555;
  `}
`;

interface ButtonProps extends ButtonBaseProps {
  loading?: boolean;
  children: ReactNode;
  onClick?: (event: any) => any;
}

const Button: FC<ButtonProps> = ({icon, variant, disabled, loading, children, onClick}) => {
  return (
    <ButtonBase icon={icon} variant={variant} disabled={disabled} onClick={onClick}>
      <Row alignItems={AlignItems.Center}>
        {loading && <>
          <ClipLoader size="10px" />
          <Spacer left={Padding.Normal} />
        </>}
        <div>
          {children}
        </div>
      </Row>
    </ButtonBase>
  );
}

export default Button;
