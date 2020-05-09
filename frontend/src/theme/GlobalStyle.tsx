import { createGlobalStyle } from 'styled-components';
import { background, foreground } from './index';

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
    font-family: 'Montserrat', sans-serif;
  }
  
  button {
    font-family: 'Montserrat', sans-serif;
  }
`;

export default GlobalStyle;
