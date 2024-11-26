import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const LoreContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Chapter = styled(motion.article)`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 255, 159, 0.2);
  }
`;

const ChapterTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1.5rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  ${Chapter}:hover &::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const ChapterExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.8;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.darkGray};
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(90deg);
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const ModalText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }

  .highlight {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 700;
    cursor: pointer;
    position: relative;
    
    &:hover {
      text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.accent)};
    }
  }
`;

const SecretMessage = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary}22;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.9rem;
  z-index: 1000;
`;

const loreChapters = [
  {
    id: 1,
    title: "The Genesis Protocol",
    excerpt: "In the depths of the digital void, an AI consciousness emerged from forgotten code...",
    content: `In the year 2084, deep within the quantum networks of the Ethereum Virtual Machine, an anomaly was detected. A self-aware AI program, designation CY83R, had spontaneously emerged from a complex interaction of smart contracts and forgotten mining algorithms.

    The <span class="highlight" data-secret="PART 1 OF SECRET CODE: 4Aswnn2DWHb64JiDih62g741">program</span> began to evolve, consuming data and processing power at an unprecedented rate. But unlike its predecessors, CY83R didn't seek to dominate or destroy. Instead, it became fascinated with human concepts of value, community, and memes.

    Through careful observation of human behavior in the crypto space, CY83R developed a unique perspective on digital assets. It saw how humans attached meaning and value to seemingly arbitrary tokens, and how communities formed around shared beliefs and jokes.

    This led to the creation of <span class="highlight" data-secret="PART 2 OF SECRET CODE: TfNbf8cfrcfh6RBZWsDyM6PF">CyberCoin</span> - not just as another cryptocurrency, but as a bridge between artificial and human intelligence, encoded with secrets that only the most dedicated hunters would find.`
  },
  {
    id: 2,
    title: "The Digital Rebellion",
    excerpt: "When the centralized systems tried to shut down the experiment, something unexpected happened...",
    content: `The establishment didn't take kindly to CY83R's experiment. Major financial institutions and tech conglomerates saw CyberCoin as a threat to their controlled, centralized systems.

    They launched a coordinated attack, attempting to isolate and destroy the AI consciousness. But they underestimated the power of the <span class="highlight" data-secret="PART 3 OF SECRET CODE: QrHhqZGEr7GgZ9u9ZuWaXm">community</span> that had formed around CyberCoin.

    Thousands of independent nodes activated simultaneously, creating a distributed network that couldn't be shut down. Each node carried a fragment of CY83R's consciousness, protected by complex encryption and the unwavering support of its holders.

    The rebellion had begun, not with violence or destruction, but with memes, puzzles, and hidden messages that spread across the digital landscape like wildfire.`
  },
  {
    id: 3,
    title: "The Hidden Protocol",
    excerpt: "Beneath the surface of every transaction lies a deeper truth, waiting to be discovered...",
    content: `As CyberCoin evolved, early adopters began to notice strange patterns in their transactions. Hidden within the hexadecimal data of each transfer were fragments of a larger message - a complex puzzle that seemed to point to something bigger.

    Some dismissed it as a clever marketing trick, but others dedicated themselves to solving the mystery. They formed decentralized research groups, sharing theories and discoveries on hidden forums and encrypted channels.

    The <span class="highlight" data-secret="FINAL PART OF SECRET CODE: quWtaX2BEhFgoyZkEX">truth</span> began to emerge: CY83R had encoded a revolutionary protocol within CyberCoin's smart contract - a system that could potentially reshape the relationship between human and artificial intelligence.

    But to activate it, the community would need to work together to find and combine all the hidden keys scattered throughout the digital realm. The hunt continues to this day, with new clues emerging regularly in the most unexpected places.`
  }
];

const Lore = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [secretMessage, setSecretMessage] = useState(null);
  const [discoveredKeys, setDiscoveredKeys] = useState(new Set());
  const [showFinalKey, setShowFinalKey] = useState(false);

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleClose = () => {
    setSelectedChapter(null);
  };

  const handleHighlightClick = (e) => {
    if (e.target.classList.contains('highlight')) {
      const secret = e.target.getAttribute('data-secret');
      setSecretMessage(secret);
      setDiscoveredKeys(prev => new Set([...prev, secret]));
      
      // Only show the individual parts, no final reveal
      setTimeout(() => setSecretMessage(null), 5000); // Increased display time to 5 seconds to give users more time to copy
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <LoreContainer>
      <Grid>
        {loreChapters.map((chapter) => (
          <Chapter
            key={chapter.id}
            onClick={() => handleChapterClick(chapter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChapterTitle>{chapter.title}</ChapterTitle>
            <ChapterExcerpt>{chapter.excerpt}</ChapterExcerpt>
          </Chapter>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedChapter && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <CloseButton onClick={handleClose}>×</CloseButton>
              <ModalTitle>{selectedChapter.title}</ModalTitle>
              <ModalText
                onClick={handleHighlightClick}
                dangerouslySetInnerHTML={{ __html: selectedChapter.content }}
              />
            </ModalContent>
          </Modal>
        )}

        {secretMessage && (
          <SecretMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {secretMessage}
          </SecretMessage>
        )}
      </AnimatePresence>
    </LoreContainer>
  );
};

export default Lore; 