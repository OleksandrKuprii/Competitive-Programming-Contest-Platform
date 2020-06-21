import { createGlobalStyle } from 'styled-components';
import { backgroundColors, foregroundColors } from '~/mixins/color';

const GlobalStyle = createGlobalStyle`
  * {
    outline: none;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }

  body, html {
    margin: 0;
    padding: 0;

    overflow: hidden;
  }
  
  body {
    background: ${backgroundColors.light};
    color: ${foregroundColors.light};
  }
  
  body, button, input, textarea {
    font-family: 'Roboto', sans-serif;
  }
  
  ::-webkit-scrollbar-track
  {
      background-color: transparent;
  }

  ::-webkit-scrollbar, ::-webkit-scrollbar-corner
  {
      width: 12px;
      background-color: transparent;
  }

  ::-webkit-scrollbar-thumb
  {
      background-color: #555;
  }
`;

export default GlobalStyle;
