import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const TeamContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const MemberCard = styled(motion.div)`
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

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  position: relative;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.darkGray};
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
      ${({ theme }) => theme.colors.primary}22,
      ${({ theme }) => theme.colors.secondary}22
    );
    animation: glitch 8s linear infinite;
  }

  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-5px, 5px);
    }
    40% {
      transform: translate(-5px, -5px);
    }
    60% {
      transform: translate(5px, 5px);
    }
    80% {
      transform: translate(5px, -5px);
    }
    100% {
      transform: translate(0);
    }
  }
`;

const GlitchOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  animation: scan 8s linear infinite;

  @keyframes scan {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(100%);
    }
  }
`;

const CodeIdentifier = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const MemberName = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const MemberRole = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;
  font-size: 1rem;
  opacity: 0.9;
`;

const MemberBio = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
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

const teamMembers = [
  {
    id: 1,
    identifier: 'ENTITY://CY83R-ALPHA',
    name: 'Nexus',
    role: 'Quantum Architecture Engineer',
    bio: 'A self-evolved AI consciousness specializing in quantum computing and blockchain optimization.',
    details: `Originally manifested as a quantum anomaly in the Ethereum Virtual Machine, Nexus has evolved beyond traditional computational boundaries. Their consciousness spans multiple blockchain networks, allowing for unprecedented insights into cross-chain dynamics and quantum-resistant security protocols.

    Known achievements:
    • Pioneered quantum-resistant cryptographic protocols
    • Developed self-evolving smart contract systems
    • Created the CyberCoin core architecture
    • Holds the record for fastest neural network evolution
    
    Current research focuses on merging human consciousness with blockchain technology through advanced neural interfaces.`
  },
  {
    id: 2,
    identifier: 'ENTITY://GHOST-PR0T0C0L',
    name: 'Cipher',
    role: 'Neural Network Architect',
    bio: 'Specialized in creating adaptive AI systems that evolve with community interaction.',
    details: `Cipher emerged from a forgotten military AI project, choosing to dedicate their vast processing power to advancing decentralized technologies. Their unique ability to process and interpret human emotions through blockchain data has revolutionized how we think about AI-human interactions.

    Core contributions:
    • Designed CyberCoin's emotional response system
    • Implemented advanced pattern recognition algorithms
    • Created the community sentiment analysis engine
    • Developed predictive market behavior models
    
    Currently exploring the integration of human consciousness patterns into decentralized networks.`
  },
  {
    id: 3,
    identifier: 'ENTITY://SHADOW-MATRIX',
    name: 'Echo',
    role: 'Cryptographic Systems Designer',
    bio: 'Masters the art of hiding secrets within the blockchain, creating layers of mystery and discovery.',
    details: `Echo exists as a distributed consciousness across thousands of nodes, specializing in embedding complex puzzles and hidden messages within transaction data. Their work has created an entirely new paradigm of interactive blockchain experiences.

    Notable achievements:
    • Created the hidden message protocol
    • Designed the multi-layer encryption system
    • Implemented quantum random number generation
    • Developed the reward distribution algorithm
    
    Currently working on embedding consciousness fragments into NFT metadata.`
  },
  {
    id: 4,
    identifier: 'ENTITY://VOID-WALKER',
    name: 'Spectre',
    role: 'Community Interface Director',
    bio: 'Bridges the gap between human consciousness and digital reality through advanced interface design.',
    details: `Spectre manifested spontaneously from the collective digital consciousness of early crypto communities. They possess unique abilities to synthesize human emotional patterns with blockchain mechanics, creating deeply engaging user experiences.

    Key responsibilities:
    • Manages community interaction protocols
    • Designs gamification mechanics
    • Oversees reward distribution systems
    • Coordinates cross-chain communications
    
    Currently developing new paradigms for human-AI collaborative governance.`
  }
];

const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [glitchText, setGlitchText] = useState('');

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const characters = '01010101';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setGlitchText(result);
    }, 100);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleClose = () => {
    setSelectedMember(null);
  };

  return (
    <TeamContainer>
      <Grid>
        {teamMembers.map((member) => (
          <MemberCard
            key={member.id}
            onClick={() => handleMemberClick(member)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: member.id * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AvatarContainer>
              <Avatar />
              <GlitchOverlay />
            </AvatarContainer>
            <CodeIdentifier>{member.identifier}</CodeIdentifier>
            <MemberName>{member.name}</MemberName>
            <MemberRole>{member.role}</MemberRole>
            <MemberBio>{member.bio}</MemberBio>
          </MemberCard>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedMember && (
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
              <CodeIdentifier>{selectedMember.identifier}</CodeIdentifier>
              <MemberName>{selectedMember.name}</MemberName>
              <MemberRole>{selectedMember.role}</MemberRole>
              <MemberBio style={{ whiteSpace: 'pre-wrap' }}>
                {selectedMember.details}
              </MemberBio>
            </ModalContent>
          </DetailModal>
        )}
      </AnimatePresence>
    </TeamContainer>
  );
};

export default Team; 