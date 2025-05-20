import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  color: ${({ theme }) => theme.colors.primary};
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

a {
  text-decoration: none;
}

#player-container {
  position: sticky;
  top: 0;
}

`;

export default GlobalStyle;
