import styled from 'styled-components';
import BaseButton from '@/atoms/button/BaseButton';
import { color, hoverColor } from '~/theme';

const Button = styled(BaseButton)<{ variant?: string }>`
  padding: 0 20px;
  background-color: ${color};

  &:hover {
    background-color: ${hoverColor};
  }
`;

Button.defaultProps = {
  variant: 'dark',
};

export default Button;
