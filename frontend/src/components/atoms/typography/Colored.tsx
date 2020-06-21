import styled from 'styled-components';
import { foreground } from '~/mixins/color';

const Colored = styled.span<{ variant?: string }>`
  color: ${foreground};
`;

Colored.defaultProps = {
  variant: 'primary',
};

export default Colored;
