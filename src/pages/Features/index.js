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
    title: 'AI Integration',
    description: 'Advanced artificial intelligence systems powering token mechanics and community interactions.',
    details: `Our AI integration goes beyond simple automation. The CyberCoin protocol utilizes cutting-edge machine learning algorithms to:

    • Analyze market sentiment and adjust token mechanics in real-time
    • Generate unique NFT artwork based on holder behavior
    • Create personalized engagement experiences for community members
    • Predict and prevent potential security threats
    • Optimize gas usage during high-traffic periods

    The AI system learns and evolves with the community, creating a truly dynamic ecosystem that becomes more efficient over time.`
  },
  {
    id: 2,
    icon: '🔐',
    title: 'Quantum-Resistant Security',
    description: 'Next-generation cryptographic protocols designed to withstand quantum computing attacks.',
    details: `CyberCoin's security infrastructure is built for the future. Our quantum-resistant features include:

    • Post-quantum cryptographic algorithms
    • Multi-layered encryption protocols
    • Quantum entropy source for true randomness
    • Adaptive security measures that evolve with threats
    • Regular security audits and updates

    We're not just securing today's transactions - we're preparing for tomorrow's challenges.`
  },
  {
    id: 3,
    icon: '🎮',
    title: 'Interactive Gameplay',
    description: 'Earn rewards by solving puzzles and participating in the evolving narrative.',
    details: `Our gameplay mechanics transform holding crypto into an immersive experience:

    • Daily challenges and puzzles with token rewards
    • Hidden messages within transaction data
    • Community-driven narrative development
    • Real-time leaderboards and achievements
    • Special events tied to market milestones

    Every interaction with CyberCoin is a chance to discover something new and earn rewards.`
  },
  {
    id: 4,
    icon: '🌐',
    title: 'Decentralized Governance',
    description: 'Community-driven decision making through advanced DAO mechanisms.',
    details: `Our governance system puts the power in the community's hands:

    • Quadratic voting for fair representation
    • Proposal templates for easy participation
    • Automated execution of approved changes
    • Transparent voting records on-chain
    • Multiple voting mechanisms for different types of decisions

    Every holder has a voice in shaping CyberCoin's future.`
  },
  {
    id: 5,
    icon: '🔄',
    title: 'Dynamic Tokenomics',
    description: 'Self-adjusting economic model that responds to market conditions.',
    details: `Our tokenomics model uses advanced algorithms to maintain stability:

    • Adaptive burn rate based on market activity
    • Dynamic staking rewards
    • Automatic liquidity management
    • Anti-whale mechanisms
    • Community reward pools

    The system continuously optimizes for long-term sustainability.`
  },
  {
    id: 6,
    icon: '🎨',
    title: 'Generative NFT System',
    description: 'AI-powered NFT creation based on holder activity and community events.',
    details: `Our NFT system creates unique digital artifacts that evolve with the community:

    • AI-generated artwork based on blockchain activity
    • Interactive NFTs that respond to holder behavior
    • Collaborative community art projects
    • Hidden features and upgrades
    • Cross-chain compatibility

    Each NFT tells a story and holds secrets waiting to be discovered.`
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