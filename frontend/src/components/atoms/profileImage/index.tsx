import styled, { css } from 'styled-components';
import circle from '~/mixins/circle';
import { color } from '~/theme';

const ProfileImage = styled.div<{ src?: string }>`
  ${circle}

  ${(props) =>
    props.src
      ? css`
    background-image: url("${props.src}");
    background-size: cover;
  `
      : css`
          background-color: ${color};
        `}

  
  width: 100px;
  height: 100px;
`;

ProfileImage.defaultProps = {
  // @ts-ignore
  variant: 'dark',
};

export default ProfileImage;
