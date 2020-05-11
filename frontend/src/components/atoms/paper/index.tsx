import styled from 'styled-components';
import Box from '@/atoms/box';

const Paper = styled(Box)`
  * {
    font-family: 'Open Sans', sans-serif;
  }
`;

Paper.defaultProps = {
  padding: 30,
  height: 'fit-content',
};

export default Paper;
