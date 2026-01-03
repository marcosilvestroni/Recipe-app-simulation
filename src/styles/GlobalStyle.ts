import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: #ff6b6b;
    --color-primary-dark: #e05555;
    --color-secondary: #4ecdc4;
    --color-background: #f7f9fc;
    --color-surface: #ffffff;
    --color-text: #2d3436;
    --color-text-light: #636e72;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --radius-md: 8px;
    --radius-lg: 16px;
    --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  body {
    margin: 0;
    font-family: var(--font-family);
    background-color: var(--color-background);
    color: var(--color-text);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.2s ease;
  }
`;
