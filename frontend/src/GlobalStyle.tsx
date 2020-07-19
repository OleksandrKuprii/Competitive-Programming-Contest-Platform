import { createGlobalStyle } from 'styled-components';
import { backgroundColors, foregroundColors } from '~/mixins/color';

const GlobalStyle = createGlobalStyle`
  * {
    outline: none;
    box-sizing: border-box;
    
    font-family: 'Roboto', sans-serif !important;
  }
  
  code, code * {
    font-family: 'Source Code Pro', monospace !important;
    font-size: 16px;
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

    letter-spacing: 0.5px;
  }
  
  a, a:hover {
    color: inherit;
    text-decoration: none;
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
      background-color: #aaa;
  }
`;

export default GlobalStyle;
