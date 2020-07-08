import styled, {css} from "styled-components";
import {background, foreground, hoverBackground, hoverForeground} from "~/mixins/color";


interface ButtonProps {
  icon?: boolean;
  variant?: string;
}


const Button = styled.button<ButtonProps>`
  border: none;
  background: ${background};
  color: ${foreground};
  
  padding: 10px 15px;
  
  font-size: 14px;
  
  font-weight: bolder;
  
  text-transform: uppercase;
  
  border-radius: 5px;
  
  transition: all 0.3s;
  
  &:hover {
    background: ${hoverBackground};
    color: ${hoverForeground};
  }
  
  ${props => props.icon && css`
    font-size: 18px;
  `};
`;

export default Button;
