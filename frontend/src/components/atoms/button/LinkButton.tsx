import styled from 'styled-components';
import BaseButton from '@/atoms/button/BaseButton';
import { color } from '~/theme';

const LinkButton = styled(BaseButton)<{ variant?: string }>`
  &:hover {
    color: ${color};
  }
`;

LinkButton.defaultProps = {
  variant: 'primary',
};

export default LinkButton;
