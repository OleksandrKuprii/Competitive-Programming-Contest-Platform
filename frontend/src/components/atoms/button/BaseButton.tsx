import styled from 'styled-components';
import { foreground } from '~/theme';

const BaseButton = styled.button`
  border: none;
  color: ${foreground};
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export default BaseButton;
