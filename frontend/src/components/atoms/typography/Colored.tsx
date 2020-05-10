import styled from 'styled-components';
import { baseParagraph } from '@/atoms/typography';
import { color } from '~/theme';

const Colored = styled(baseParagraph)<{ variant?: string }>`
  color: ${color};
`;

Colored.defaultProps = {
  variant: 'primary',
};

export default Colored;
