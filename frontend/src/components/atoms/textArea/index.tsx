import styled from "styled-components";
import { background, foreground } from "~/mixins/color";
import { normalShadow } from "~/mixins/shadow";


const TextArea = styled.textarea<{ variant?: string }>`
  background: ${background};
  color: ${foreground};
  padding: 10px;
  border: none;
  width: 100%;
  resize: none;
  
  ${normalShadow};
`;

TextArea.defaultProps = {
  variant: 'dark'
};

export default TextArea;
