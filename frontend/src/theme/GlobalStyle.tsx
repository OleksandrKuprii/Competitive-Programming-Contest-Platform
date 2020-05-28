import { createGlobalStyle } from 'styled-components';
import { background, foreground } from '~/theme';

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
  }
  
  body {
    background: ${background};
    color: ${foreground};
  }
  
  body, button, input, textarea {
    font-family: 'Montserrat', sans-serif;
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
