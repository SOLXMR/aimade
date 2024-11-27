import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Features from './pages/Features';
import Games from './pages/Games';
import Lore from './pages/Lore';
import Team from './pages/Team';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/games" element={<Games />} />
          <Route path="/lore" element={<Lore />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 