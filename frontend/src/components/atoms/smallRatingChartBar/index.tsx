import styled from 'styled-components';
import { color } from '~/theme';

const SmallRatingChartBar = styled.div<{ percentage: number; variant: string }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background-color: ${color};
`;

export default SmallRatingChartBar;
