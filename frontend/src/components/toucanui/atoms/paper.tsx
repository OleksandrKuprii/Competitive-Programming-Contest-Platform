import styled from 'styled-components';
import Box from '@/toucanui/atoms/box';
import {Padding} from "~/mixins/padding";
import {normalShadow} from "~/mixins/shadow";

const Paper = styled(Box)`
  ${normalShadow};
  
  border-top: 35px solid rgba(0, 0, 0, 0.05);
`;

Paper.defaultProps = {
};

export default Paper;
