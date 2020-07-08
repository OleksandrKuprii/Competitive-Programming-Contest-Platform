import styled, { css } from 'styled-components';
import circle from '~/mixins/circle';

const ProfileImage = styled.div<{ src?: string }>`
  width: 60px;
  height: 60px;
  
  ${props => props.src ? css`
    background-image: url("${props.src}");
  ` : css`
    background-image: linear-gradient(45deg, #333, #777);
  `};
  
  background-size: cover;
  
  ${circle};
`;



export default ProfileImage;
