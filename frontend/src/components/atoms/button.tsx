import styled, {css} from "styled-components";
import {background, foreground, hoverBackground, hoverForeground} from "~/mixins/color";


interface ButtonProps {
  icon?: boolean;
  variant?: string;
  disabled?: boolean;
}


const Button = styled.button<ButtonProps>`
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

export default Button;
