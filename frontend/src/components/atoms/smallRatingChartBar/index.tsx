import styled from 'styled-components';
import { background } from '~/mixins/color';

const SmallRatingChartBar = styled.div<{ percentage: number; variant: string }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background-color: ${background};
`;

export default SmallRatingChartBar;
