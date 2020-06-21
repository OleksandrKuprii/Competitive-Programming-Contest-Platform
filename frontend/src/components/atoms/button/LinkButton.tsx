import styled from 'styled-components';
import BaseButton from '@/atoms/button/BaseButton';
import { foreground } from '~/mixins/color';

const LinkButton = styled(BaseButton)<{ variant?: string }>`
  &:hover {
    color: ${foreground};
  }
`;

LinkButton.defaultProps = {
  variant: 'primary',
};

export default LinkButton;
