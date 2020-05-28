import styled from "styled-components";
import { color, foreground } from "~/theme";
import shadow from "~/mixins/shadow";


const TextArea = styled.textarea<{ variant?: string }>`
  background: ${color};
  color: ${foreground};
  padding: 10px;
  border: none;
  width: 100%;
  resize: none;
  
  ${shadow};
`;

TextArea.defaultProps = {
  variant: 'dark'
};

export default TextArea;
