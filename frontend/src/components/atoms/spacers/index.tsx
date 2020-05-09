import styled from 'styled-components';

export const Spacer = styled.div<{ size?: number }>`
  padding: ${(props) => (props.size ? `${props.size}px` : '40px')};
`;

export const HorizontalSpacer = styled.div<{ size?: number }>`
  padding: ${(props) => (props.size ? `0 ${props.size}px` : '0 40px')};
`;
