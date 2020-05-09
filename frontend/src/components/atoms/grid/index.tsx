import styled, { css } from 'styled-components';

const Flex = styled.div<{ justifyContent?: string }>`
  display: flex;
  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

export const Grid = styled(Flex)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Row = styled(Flex)``;

export const Col = styled.div<{ size?: number | 'none' }>`
  flex: ${(props) => props.size || 1};
  flex-basis: 0;

  padding-left: 20px;

  &:first-child {
    padding-left: 0;
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
`;
