import styled from "styled-components";
import {background, foreground, hoverBackground} from "~/mixins/color";


const Button = styled.button`
  border: none;
  background: ${background};
  color: ${foreground};
  
  padding: 10px 15px;
  
  font-size: 14px;
  
  font-weight: bolder;
  
  text-transform: uppercase;
  
  border-radius: 5px;
  
  transition: background 0.3s;
  
  &:hover {
    background: ${hoverBackground};
  }
`;

export default Button;
