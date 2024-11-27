import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Navigation from './components/Navigation';
import WalletGate from './components/WalletGate';
import Home from './pages/Home';
import Features from './pages/Features';
import Games from './pages/Games';
import Lore from './pages/Lore';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';
import Community from './pages/Community';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Wallet from './pages/Wallet';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if Phantom is installed
        if (!window.solana || !window.solana.isPhantom) {
          setWalletConnected(false);
          localStorage.removeItem('walletConnected');
          return;
        }

        // Check if already connected
        const resp = await window.solana.connect({ onlyIfTrusted: true });
        if (resp.publicKey) {
          setWalletConnected(true);
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletPublicKey', resp.publicKey.toString());
        } else {
          setWalletConnected(false);
          localStorage.removeItem('walletConnected');
        }
      } catch (error) {
        console.error('Wallet connection check failed:', error);
        setWalletConnected(false);
        localStorage.removeItem('walletConnected');
      }
    };

    checkWalletConnection();
  }, []);

  const handleWalletConnect = (publicKey) => {
    setWalletConnected(true);
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('walletPublicKey', publicKey);
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletPublicKey');
    if (window.solana && window.solana.isPhantom) {
      window.solana.disconnect();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!walletConnected ? (
        <WalletGate onConnect={handleWalletConnect} />
      ) : (
        <Router>
          <Navigation onDisconnect={handleDisconnect} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/games" element={<Games />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/team" element={<Team />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App; 