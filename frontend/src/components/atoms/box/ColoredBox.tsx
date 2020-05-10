import styled from 'styled-components';
import Box from '@/atoms/box';
import { color } from '~/theme';

const ColoredBox = styled(Box)<{ variant?: string }>`
  background-color: ${color};
`;

export default ColoredBox;
