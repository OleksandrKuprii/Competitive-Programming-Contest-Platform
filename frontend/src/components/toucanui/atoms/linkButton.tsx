import styled from "styled-components";
import {background, hoverBackground} from "~/mixins/color";


const LinkButton = styled.button<{ variant?: string }>`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  
  text-align: left;
  
  color: ${background};
  
  &:hover {
    text-decoration: underline;
    color: ${hoverBackground};
  }
`;

export default LinkButton;
