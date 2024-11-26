import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: ${({ theme }) => theme.colors.primary};
    --secondary: ${({ theme }) => theme.colors.secondary};
    --accent: ${({ theme }) => theme.colors.accent};
    --background: ${({ theme }) => theme.colors.background};
    --text: ${({ theme }) => theme.colors.text};
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: var(--background);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    
    &::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
        repeating-linear-gradient(
          0deg,
          transparent 0,
          transparent 1px,
          rgba(0, 255, 159, 0.1) 1px,
          rgba(0, 255, 159, 0.1) 2px
        );
      background-size: 100% 100%, 100% 4px;
      pointer-events: none;
      z-index: -1;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: var(--primary);
    text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: var(--primary);
      text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }

    &:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  button {
    font-family: ${({ theme }) => theme.fonts.main};
    cursor: pointer;
    border: 1px solid var(--primary);
    background: transparent;
    color: var(--primary);
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: var(--primary);
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.3s ease;
      z-index: -1;
    }

    &:hover {
      color: var(--background);
      text-shadow: none;
      
      &::before {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.darkGray};
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
    
    &:hover {
      background: var(--accent);
    }
  }

  ::selection {
    background: var(--primary);
    color: var(--background);
  }
`;

export default GlobalStyle; 