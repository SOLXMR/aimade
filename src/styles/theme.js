export const theme = {
  colors: {
    background: '#0a0a0a',
    primary: '#00ff9f',
    secondary: '#ff00ff',
    accent: '#00ffff',
    text: '#ffffff',
    darkGray: '#1a1a1a',
    error: '#ff0033',
  },
  fonts: {
    main: '"Fira Code", "Consolas", monospace',
    heading: '"Share Tech Mono", monospace',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  animations: {
    glitch: {
      duration: '0.3s',
      timing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    fade: {
      duration: '0.4s',
      timing: 'ease-in-out',
    },
  },
  shadows: {
    neon: (color) => `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`,
    text: (color) => `0 0 2px ${color}`,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
  },
} 