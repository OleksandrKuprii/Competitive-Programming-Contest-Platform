import styled, { css } from 'styled-components';
import circle from '~/mixins/circle';

const ProfileImage = styled.div<{ src?: string }>`
  ${circle}


  
  width: 100px;
  height: 100px;
`;


//  ${(props) =>
//    props.src
//      ? css`
//    background-image: url("${props.src}");
//    background-size: cover;
//  `
//      : css`
//          background-color: ${color};
//        `}

export default ProfileImage;
