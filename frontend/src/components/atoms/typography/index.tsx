import styled, { css } from 'styled-components';

// Defining basic Text
// ALERT: using em instead of pixels

export enum TextAlign {
  Center = "center"
}

export enum FontWeight {
  Bold  = "bold",
  Light = "lighter"
}

export const Text = styled.p<{
  align?: TextAlign;
  weight?: FontWeight;
  size?: number;
  letterSpacing?: number;
}>`
  margin: 0;
  padding: 0.5em 0.7em;
  
  text-align: ${props => props.align};

  font-weight: ${props => props.weight};
  font-size: ${props => props.size || 1}em;

  letter-spacing: ${props => props.letterSpacing || 0.5}px;
`;

export const Title = (() => {
  const title = styled(Text)``;

  title.defaultProps = ({
    size: 1.5,
    letterSpacing: -1.5,
    weight: FontWeight.Light,
  });

  return title;
})();

export const Subtitle = (() => {
  const title = styled(Text)``;

  title.defaultProps = ({
    size: 2,
    weight: FontWeight.Bold,
  });

  return title;
})();
