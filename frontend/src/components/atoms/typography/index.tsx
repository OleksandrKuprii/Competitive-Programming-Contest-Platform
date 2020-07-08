import styled, { css } from 'styled-components';

// Defining basic Text
// ALERT: using em instead of pixels

export enum TextAlign {
  Center = "center",
  Right  = "right"
}

export enum FontWeight {
  Bold   = "bold",
  Medium = 500,
  Light  = "lighter"
}

export const Text = styled.p<{
  align?: TextAlign;
  weight?: FontWeight;
  size?: number;
  letterSpacing?: number;
  lineHeight?: string;
}>`
  margin: 0;
  padding: 0;
  
  text-align: ${props => props.align};

  font-weight: ${props => props.weight};
  font-size: ${props => props.size || 1}em;

  letter-spacing: ${props => props.letterSpacing || 0.5}px;
  
  ${props => props.lineHeight && css`
    line-height: ${props.lineHeight};
  `};
`;

export const Title = (() => {
  const title = styled(Text)``;

  title.defaultProps = ({
    size: 1.5,
    letterSpacing: -1.5,
    weight: FontWeight.Light,
    lineHeight: '140%',
  });

  return title;
})();

export const Subtitle = (() => {
  const title = styled(Text)``;

  title.defaultProps = ({
    size: 1.25,
    letterSpacing: 0.15,
  });

  return title;
})();
