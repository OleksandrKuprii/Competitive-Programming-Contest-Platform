import styled from 'styled-components';
import Box from '@/toucanui/atoms/box';
import {Padding} from "~/mixins/padding";
import {normalShadow} from "~/mixins/shadow";

const Paper = styled(Box)`
  ${normalShadow};
  
  border-top: 35px solid #ddd;
`;

Paper.defaultProps = {
};

export default Paper;
