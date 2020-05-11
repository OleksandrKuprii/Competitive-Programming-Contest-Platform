import styled, { css } from 'styled-components';
import { color, foreground } from '~/theme';

const Link = styled.a<{ variant?: string; noHover?: boolean }>`
  cursor: pointer;
  color: ${foreground};
  text-decoration: none;

  ${(props) =>
    !props.noHover &&
    css`
      &:hover {
        color: ${color};
      }
    `}
`;

Link.defaultProps = {
  variant: 'primary',
};

export default Link;
