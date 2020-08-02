import { createGlobalStyle } from 'styled-components';
import {backgroundColors, foreground, foregroundColors, linkColor, linkColors} from '~/mixins/color';

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
  }
  
  a {
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  ::-webkit-scrollbar-track
  {
      background-color: transparent;
  }

  ::-webkit-scrollbar, ::-webkit-scrollbar-corner
  {
      width: 12px;
      height: 12px;
      background-color: transparent;
  }

  ::-webkit-scrollbar-thumb
  {
      background-color: #aaa;
  }
`;

export default GlobalStyle;
