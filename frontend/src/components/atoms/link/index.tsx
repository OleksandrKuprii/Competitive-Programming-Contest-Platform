import styled from 'styled-components';
import { color, foreground } from '~/theme';

const Link = styled.a<{ variant?: string }>`
  cursor: pointer;
  color: ${foreground};
  text-decoration: none;

  &:hover {
    color: ${color};
  }
`;

Link.defaultProps = {
  variant: 'primary',
};

export default Link;
