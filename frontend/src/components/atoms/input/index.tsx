import styled from 'styled-components';
import { normalShadow } from '~/mixins/shadow';
import { background, foreground } from '~/mixins/color';

const Input = styled.input<{ variant?: string }>`
  ${normalShadow};

  background-color: ${background};
  color: ${foreground};

  border: none;
  padding: 10px;
  font-size: 1em;
`;

Input.defaultProps = {
  variant: 'dark',
};

export default Input;
