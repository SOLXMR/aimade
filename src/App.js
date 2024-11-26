import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Lore from './pages/Lore';
import Features from './pages/Features';
import Team from './pages/Team';
import Roadmap from './pages/Roadmap';
import FAQ from './pages/FAQ';
import Community from './pages/Community';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lore" element={<Lore />} />
          <Route path="/features" element={<Features />} />
          <Route path="/team" element={<Team />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/community" element={<Community />} />
          <Route path="/games" element={<Games />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 