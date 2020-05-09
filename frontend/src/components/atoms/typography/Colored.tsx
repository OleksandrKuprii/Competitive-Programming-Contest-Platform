import styled from 'styled-components';
import { color } from '../../../theme';
import { baseParapgraph } from './index';

const Colored = styled(baseParapgraph)<{ variant?: string }>`
  color: ${color};
`;

Colored.defaultProps = {
  variant: 'primary',
};

export default Colored;
