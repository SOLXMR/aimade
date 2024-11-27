import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
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

const FeatureCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 2rem;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
`;

const DetailModal = styled(motion.div)`
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

const features = [
  {
    id: 1,
    icon: '🧠',
    title: 'Hidden Developer Wallet',
    description: 'A mysterious wallet awaits discovery within the depths of our website.',
    details: `The developer wallet isn't just a wallet - it's a digital treasure waiting to be claimed:

    • Hidden somewhere in the website's code or visuals
    • Multiple clues scattered throughout the interface
    • Requires wit and technical skills to discover
    • No hints from the team - fair game for all
    • First to find it, owns it

    Will you be the one to crack the code and claim your share of the power?`
  },
  {
    id: 2,
    icon: '🎭',
    title: 'Pure Meme Power',
    description: 'No complicated mechanics, just pure community-driven meme energy.',
    details: `We've stripped away the complexity to focus on what matters:

    • 100% community-owned token
    • No fancy tokenomics or gimmicks
    • Powered by memes and community spirit
    • Zero private allocations
    • Fair launch for everyone

    CyberCoin is what you make of it - pure, simple, and powerful.`
  },
  {
    id: 3,
    icon: '🎮',
    title: 'Digital Treasure Hunt',
    description: 'Explore, decode, and discover secrets hidden throughout the website.',
    details: `Our website is more than just a website - it's a playground of secrets:

    • Multiple layers of hidden content
    • Cryptographic puzzles and challenges
    • Real rewards for those who solve them
    • New secrets added regularly
    • Community hints and collaboration

    Every click could lead to a discovery, every page could hide a secret.`
  },
  {
    id: 4,
    icon: '🌐',
    title: 'Matrix Challenges',
    description: 'Navigate through our Matrix-inspired digital realm.',
    details: `Dive deep into the digital abyss:

    • Interactive Matrix-style challenges
    • Hidden messages in the code rain
    • Glitch effects hiding secrets
    • Pattern recognition puzzles
    • Cyberpunk-themed rewards

    The deeper you go, the more you'll find.`
  },
  {
    id: 5,
    icon: '👥',
    title: 'Community Power',
    description: 'A token truly owned and driven by its community.',
    details: `We believe in the power of community:

    • No team allocations
    • No venture capital
    • No private sales
    • 100% community owned
    • Everyone has equal opportunity

    The power is in your hands - literally.`
  },
  {
    id: 6,
    icon: '🎲',
    title: 'Ongoing Events',
    description: 'Regular events and challenges for the community.',
    details: `Stay engaged with regular community activities:

    • Live treasure hunts
    • Code breaking competitions
    • Community puzzle solving
    • Reward pools for winners
    • Collaborative challenges

    The hunt never ends - there's always something new to discover.`
  }
];

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleClose = () => {
    setSelectedFeature(null);
  };

  return (
    <FeaturesContainer>
      <Grid>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            onClick={() => handleFeatureClick(feature)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: feature.id * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedFeature && (
          <DetailModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CloseButton onClick={handleClose}>×</CloseButton>
              <FeatureIcon>{selectedFeature.icon}</FeatureIcon>
              <FeatureTitle>{selectedFeature.title}</FeatureTitle>
              <FeatureDescription
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {selectedFeature.details}
              </FeatureDescription>
            </ModalContent>
          </DetailModal>
        )}
      </AnimatePresence>
    </FeaturesContainer>
  );
};

export default Features; 