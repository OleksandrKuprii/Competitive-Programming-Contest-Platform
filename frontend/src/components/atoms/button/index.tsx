import styled from 'styled-components';
import BaseButton from '@/atoms/button/BaseButton';
import { background, hoverBackground } from '~/mixins/color';

const Button = styled(BaseButton)<{ variant?: string }>`
  padding: 15px;
  background-color: ${background};

  &:not(:disabled):hover {
    background-color: ${hoverBackground};
  }
  
  :disabled {
    cursor: not-allowed;
  }
`;

Button.defaultProps = {
  variant: 'dark',
};

export default Button;
