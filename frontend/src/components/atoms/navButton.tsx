// navButton.tsx - button override for navigation bar

import styled from "styled-components";
import Button from "@/atoms/button";

const NavButton = styled(Button)`
  border-radius: 0;
  
  height: 100%;
  max-height: 100%;
  
  font-size: 200%;
  
  color: #aaa;
  
  &:hover {
    color: #fff;
  }
`;

export default NavButton;
