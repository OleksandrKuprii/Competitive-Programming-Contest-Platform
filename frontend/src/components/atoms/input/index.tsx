import styled from 'styled-components';
import shadow from '~/mixins/shadow';
import { color, foreground } from '~/theme';

const Input = styled.input<{ variant?: string }>`
  ${shadow};

  background-color: ${color};
  color: ${foreground};

  border: none;
  padding: 10px;
  font-size: 1em;
`;

Input.defaultProps = {
  variant: 'dark',
};

export default Input;
