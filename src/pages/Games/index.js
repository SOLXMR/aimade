import React, { useEffect, useRef, useState, Suspense, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Text3D, Center } from '@react-three/drei';
import gsap from 'gsap';

const GamesContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const GameCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 2rem;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.colors.primary}0a,
      ${({ theme }) => theme.colors.secondary}0a
    );
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      ${({ theme }) => theme.colors.primary}22,
      transparent
    );
    transform: rotate(45deg);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: rotate(45deg) translate(50%, 50%);
  }
`;

const GameTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const GameDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const FullscreenGame = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }
`;

// Memory Game Component
const MemoryGame = ({ onClose }) => {
  const theme = useContext(ThemeContext);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const symbols = ['λ', 'Ω', 'Σ', 'Δ', 'Φ', 'Ψ', '∞', '⌘'];
  
  useEffect(() => {
    // Initialize cards
    const cardPairs = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    setCards(cardPairs);
  }, []);

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;

      if (cards[first].symbol === cards[second].symbol) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <FullscreenGame
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        padding: '2rem'
      }}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            style={{
              width: '100px',
              height: '100px',
              background: flipped.includes(index) || matched.includes(index)
                ? theme.colors.primary
                : theme.colors.darkGray,
              border: `1px solid ${theme.colors.primary}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem',
              cursor: 'pointer',
              color: theme.colors.background
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
          >
            {(flipped.includes(index) || matched.includes(index)) && card.symbol}
          </motion.div>
        ))}
      </div>
    </FullscreenGame>
  );
};

// Hacking Game Component
const HackingGame = ({ onClose }) => {
  const theme = useContext(ThemeContext);
  const [code, setCode] = useState('');
  const [target, setTarget] = useState('');
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(5);

  useEffect(() => {
    // Generate random 4-digit binary target
    const newTarget = Array.from({ length: 4 }, () => Math.round(Math.random())).join('');
    setTarget(newTarget);
  }, []);

  const handleInput = (value) => {
    if (code.length < 4) {
      const newCode = code + value;
      setCode(newCode);

      if (newCode.length === 4) {
        checkCode(newCode);
      }
    }
  };

  const checkCode = (newCode) => {
    if (newCode === target) {
      setSuccess(true);
    } else {
      setAttempts(prev => prev - 1);
      setTimeout(() => setCode(''), 1000);
    }
  };

  return (
    <FullscreenGame
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      <div style={{ textAlign: 'center', color: theme.colors.primary }}>
        <h2>HACK THE MAINFRAME</h2>
        <p>Attempts remaining: {attempts}</p>
        <div style={{ 
          fontSize: '3rem', 
          fontFamily: 'monospace', 
          margin: '2rem 0' 
        }}>
          {code.padEnd(4, '_')}
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '200px',
          margin: '0 auto'
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleInput('0')}
            style={{
              padding: '1rem',
              background: 'none',
              border: `1px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              cursor: 'pointer'
            }}
          >
            0
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleInput('1')}
            style={{
              padding: '1rem',
              background: 'none',
              border: `1px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              cursor: 'pointer'
            }}
          >
            1
          </motion.button>
        </div>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '2rem', color: theme.colors.primary }}
          >
            ACCESS GRANTED
          </motion.div>
        )}
        {attempts === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '2rem', color: theme.colors.error }}
          >
            ACCESS DENIED
          </motion.div>
        )}
      </div>
    </FullscreenGame>
  );
};

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'memory',
      title: 'Neural Network Training',
      description: 'Train your neural pathways by matching quantum patterns. Test your memory and pattern recognition abilities.',
      Component: MemoryGame
    },
    {
      id: 'hacking',
      title: 'Mainframe Infiltration',
      description: 'Crack the binary code to gain access to the mainframe. Limited attempts to avoid detection.',
      Component: HackingGame
    }
  ];

  const renderGame = () => {
    const game = games.find(g => g.id === activeGame);
    if (!game) return null;
    
    const GameComponent = game.Component;
    return <GameComponent onClose={() => setActiveGame(null)} />;
  };

  return (
    <GamesContainer>
      <GameGrid>
        {games.map((game) => (
          <GameCard
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveGame(game.id)}
          >
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
          </GameCard>
        ))}
      </GameGrid>

      <AnimatePresence>
        {activeGame && renderGame()}
      </AnimatePresence>
    </GamesContainer>
  );
};

export default Games; 