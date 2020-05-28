import styled from 'styled-components';
import { color } from '~/theme';

const Colored = styled.span<{ variant?: string }>`
  color: ${color};
`;

Colored.defaultProps = {
  variant: 'primary',
};

export default Colored;
