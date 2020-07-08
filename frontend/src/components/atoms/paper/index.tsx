import styled from 'styled-components';
import Box from '@/atoms/box';
import {Padding} from "~/mixins/padding";
import {normalShadow} from "~/mixins/shadow";

const Paper = styled(Box)`
  font-size: 18px;
  
  ${normalShadow};
  
  border-top: 35px solid #ddd;
`;

Paper.defaultProps = {
};

export default Paper;
