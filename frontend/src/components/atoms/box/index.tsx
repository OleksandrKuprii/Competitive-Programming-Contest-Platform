import styled, { css } from 'styled-components';

const Box = styled.div<{
  padding?: number;
  width?: string;
  height?: string;
}>`
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
  box-shadow: 2px 2px 2px 2px #000;
`;

Box.defaultProps = {
  height: '100%',
};

export default Box;
