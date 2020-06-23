import styled, { css } from 'styled-components';
import { background, foreground } from '~/mixins/color';

const Link = styled.a<{ variant?: string; noHover?: boolean }>`
  cursor: pointer;
  text-decoration: none;

  ${(props) =>
    !props.noHover &&
    css`
      &:hover {
        color: ${background};
      }
    `}
`;

Link.defaultProps = {
  variant: 'primary',
};

export default Link;
