import styled, { css } from 'styled-components';
import shadow from '~/mixins/shadow';

const Box = styled.div<{
  padding?: number;
  width?: string;
  height?: string;
}>`
  ${shadow};

  height: ${(props) => props.height};
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding}px;
    `}
`;

Box.defaultProps = {
  height: '100%',
};

export default Box;
