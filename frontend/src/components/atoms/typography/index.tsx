import styled, { css } from 'styled-components';

export const baseParagraph = styled.p<{ align?: string; bold?: boolean }>`
  margin: 0;
  padding: 0;
  ${(props) =>
    props.align &&
    css`
      text-align: center;
    `}
  ${(props) =>
    props.bold &&
    css`
      font-weight: bold;
    `}
`;

export const Paragraph = styled(baseParagraph)`
  font-size: 1em;
`;

export const Title = styled(baseParagraph)`
  font-size: 2em;
  padding-bottom: 20px;
`;

export const BigTitle = styled(baseParagraph)`
  font-size: 3em;
`;

export const Subtitle = styled(baseParagraph)`
  font-size: 1.3em;
  padding: 20px 0;
`;

export const TextPaper = styled.div`
  padding: 30px;
  box-shadow: 2px 2px 2px 2px #000;
  background-color: #111;
  * {
    font-family: 'Open Sans', sans-serif;
  }
`;
