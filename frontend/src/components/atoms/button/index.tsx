import styled from 'styled-components';
import BaseButton from '@/atoms/button/BaseButton';
import { color, hoverColor } from '~/theme';

const Button = styled(BaseButton)<{ variant?: string; padding?: string }>`
  padding: ${(props) => props.padding || '0 20px'};
  background-color: ${color};

  &:not(:disabled):hover {
    background-color: ${hoverColor};
  }
  
  :disabled {
    cursor: not-allowed;
  }
`;

Button.defaultProps = {
  variant: 'dark',
};

export default Button;
