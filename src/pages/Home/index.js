import React, { useEffect, useRef, Suspense, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import gsap from 'gsap';
import { saveWalletAddress } from '../../services/walletService';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;

  .copy-success {
    position: fixed;
    top: 80px !important;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid ${({ theme }) => theme.colors.primary}4d;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.primary};
    font-family: 'Share Tech Mono', monospace;
    backdrop-filter: blur(5px);
    z-index: 1000;
  }
`;

const BackgroundEffects = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem;
  text-align: center;
`;

const GlitchText = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0.8;
  }

  &::before {
    color: ${({ theme }) => theme.colors.secondary};
    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  }

  &::after {
    color: ${({ theme }) => theme.colors.accent};
    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
  }

  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(0);
    }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  max-width: 600px;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: ${({ theme }) => theme.colors.primary};
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(45deg) translateY(100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }

  &:hover::before {
    transform: translate(-50%, -50%) rotate(45deg) translateY(0);
  }

  &:hover {
    color: ${({ theme }) => theme.colors.background};
  }
`;

const ScrollPrompt = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  z-index: 1;

  &::after {
    content: '';
    width: 2px;
    height: 50px;
    background: ${({ theme }) => theme.colors.primary};
    margin-top: 1rem;
    animation: scroll 2s ease-in-out infinite;
  }

  @keyframes scroll {
    0% {
      transform: scaleY(0);
      transform-origin: top;
    }
    50% {
      transform: scaleY(1);
      transform-origin: top;
    }
    50.1% {
      transform: scaleY(1);
      transform-origin: bottom;
    }
    100% {
      transform: scaleY(0);
      transform-origin: bottom;
    }
  }
`;

const CodeRain = ({ count = 50 }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
    const columns = Math.floor(window.innerWidth / 20);
    const drops = new Array(columns).fill(1);

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff9f';
      ctx.font = '15px "Share Tech Mono"';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.15,
        zIndex: 0,
      }}
    />
  );
};

const Scene = () => {
  return (
    <>
      <Stars
        radius={300}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const Section = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
`;

const Card = styled(motion.div)`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 2rem;
  border-radius: 4px;
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
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
`;

const TokenStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
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
  max-width: 500px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
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
`;

const ModalTitle = styled.h3`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const ModalText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const generateHackerName = () => {
  const prefixes = ['Cyber', 'Ghost', 'Shadow', 'Quantum', 'Neural', 'Binary', 'Void', 'Crypto'];
  const suffixes = ['Runner', 'Phantom', 'Protocol', 'Matrix', 'Node', 'Vector', 'Nexus', 'Zero'];
  const numbers = ['0x', '7', '9', 'X', '_', '1337', '42', '404'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${prefix}${suffix}${number}`;
};

const MatrixEntryOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const GlitchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const MatrixMessage = styled(motion.div)`
  font-size: 2rem;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const DistortSphere = () => {
  return (
    <Sphere args={[1, 100, 100]}>
      <MeshDistortMaterial
        color="#00ff9f"
        attach="material"
        distort={0.6}
        speed={1.5}
        roughness={0}
        metalness={1}
      />
    </Sphere>
  );
};

const MatrixEntry = ({ onComplete }) => {
  const canvasRef = useRef();
  const sphereRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const messages = [
      "Initializing neural interface...",
      "Bypassing security protocols...",
      "Accessing quantum mainframe...",
      "Decrypting reality matrix...",
      "Preparing for consciousness transfer...",
      "Reality distortion imminent..."
    ];

    let currentMessage = 0;
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      }
    });

    // Initial glitch effect
    tl.to('.matrix-message', {
      opacity: 1,
      duration: 0.5,
      onStart: () => {
        gsap.to('.matrix-sphere', {
          scale: 2,
          duration: 2,
          ease: "power2.inOut"
        });
      }
    });

    // Cycle through messages with glitch effects
    messages.forEach((msg, index) => {
      tl.to('.matrix-message', {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          document.querySelector('.matrix-message').textContent = msg;
        }
      })
      .to('.matrix-message', {
        opacity: 1,
        duration: 0.3,
        onStart: () => {
          // Increase sphere distortion with each message
          gsap.to('.matrix-sphere', {
            scale: 2 + index,
            duration: 1,
            ease: "power2.inOut"
          });
        }
      })
      .to({}, { duration: 1 }); // Pause between messages
    });

    // Final sequence
    tl.to('.matrix-message', {
      opacity: 0,
      duration: 0.5
    })
    .to('.matrix-entry', {
      opacity: 0,
      duration: 1
    });

    // Matrix rain effect
    const characters = '01';
    const fontSize = 20;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(0);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff9f';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        drops[i]++;

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    }

    const matrixInterval = setInterval(drawMatrix, 33);

    return () => {
      clearInterval(matrixInterval);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <MatrixEntryOverlay 
      className="matrix-entry"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <GlitchCanvas ref={canvasRef} />
      <Canvas style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <motion.group
            ref={sphereRef}
            className="matrix-sphere"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <DistortSphere />
          </motion.group>
        </Suspense>
      </Canvas>
      <MatrixMessage
        className="matrix-message"
        initial={{ opacity: 0 }}
      >
        Initializing...
      </MatrixMessage>
    </MatrixEntryOverlay>
  );
};

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1002;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  z-index: 1002;
  position: relative;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1002;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
`;

const CopyButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary}80;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}1a;
    border-color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}80;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CopyNotification = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}4d;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Share Tech Mono', monospace;
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const ViewChartButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary}80;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}1a;
    border-color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}80;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [hackerName, setHackerName] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState('');
  const [showMatrixEntry, setShowMatrixEntry] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open('https://phantom.app/', '_blank');
    throw new Error('Please install Phantom wallet');
  };

  const connectWallet = async () => {
    try {
      setError('');
      const provider = getProvider();
      setHackerName(generateHackerName());
      setShowModal(true);
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      setError(error.message);
    }
  };

  const confirmConnection = async () => {
    try {
      setError('');
      const provider = getProvider();
      
      // Request connection to wallet
      const resp = await provider.connect();
      
      // Get the public key
      const publicKey = resp.publicKey.toString();
      
      // Save to Firebase
      try {
        await saveWalletAddress(publicKey);
        console.log('Successfully saved wallet to Firebase');
      } catch (firebaseError) {
        console.error('Error saving to Firebase:', firebaseError);
      }
      
      // Store the public key
      setWalletAddress(publicKey);
      
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError(error.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      await provider.disconnect();
      setWalletAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to('.glitch-text', {
      duration: 0.1,
      skewX: 70,
      ease: 'power4.inOut',
    })
    .to('.glitch-text', {
      duration: 0.04,
      skewX: 0,
      ease: 'power4.inOut',
    })
    .to('.glitch-text', {
      duration: 0.04,
      opacity: 0,
    })
    .to('.glitch-text', {
      duration: 0.04,
      opacity: 1,
    })
    .to('.glitch-text', {
      duration: 0.04,
      x: -20,
    })
    .to('.glitch-text', {
      duration: 0.04,
      x: 0,
    })
    .add('+=4');

    return () => tl.kill();
  }, []);

  const handleMatrixEntry = () => {
    setShowMatrixEntry(true);
  };

  const handleMatrixComplete = () => {
    setShowMatrixEntry(false);
    // Add any post-animation actions here
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = async () => {
    const text = "5reTiMoyT5mCcBAWCkXzU4mZfFsEejvz1493zyQppump";
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <HomeContainer>
      <BackgroundEffects>
        <CanvasContainer>
          <Canvas
            camera={{ position: [0, 0, 1] }}
            style={{
              background: 'rgb(10, 10, 10)',
            }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </CanvasContainer>
        <CodeRain />
      </BackgroundEffects>

      <ContentContainer>
        <HeroSection>
          <GlitchText
            className="glitch-text"
            data-text="CyberCoin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            CyberCoin
          </GlitchText>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The first AI-powered memecoin with deep lore and hidden secrets.
            Uncover the truth behind the digital rebellion.
          </Subtitle>

          <CTAButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMatrixEntry}
          >
            Enter the Matrix
          </CTAButton>

          <CopyButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
          >
            Copy CA
          </CopyButton>

          <ViewChartButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://pump.fun/coin/5reTiMoyT5mCcBAWCkXzU4mZfFsEejvz1493zyQppump', '_blank')}
          >
            View Chart
          </ViewChartButton>

          <ViewChartButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/casino'}
            style={{ marginTop: '1rem' }}
          >
            Enter Casino 🎲
          </ViewChartButton>

          <ScrollPrompt
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Scroll to Explore
          </ScrollPrompt>
        </HeroSection>

        <Section>
          <SectionTitle>Token Metrics</SectionTitle>
          <SectionText>
            CyberCoin is built on advanced tokenomics with AI-driven stability mechanisms
            and community-focused distribution.
          </SectionText>
          <TokenStats>
            <StatItem>
              <StatValue>1B</StatValue>
              <StatLabel>Total Supply</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>100%</StatValue>
              <StatLabel>Community Owned</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>YOURS</StatValue>
              <StatLabel>Dev Wallet</StatLabel>
            </StatItem>
          </TokenStats>
        </Section>

        <Section>
          <SectionTitle>Core Features</SectionTitle>
          <SectionText>
            Not just another memecoin - CyberCoin hides secrets within its digital realm.
            Will you be the one to discover them?
          </SectionText>
          <Grid>
            <Card
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>Hidden Developer Wallet</h3>
              <p>Somewhere in this website lies the key to the developer wallet. Find it, and claim your share of the power.</p>
            </Card>
            <Card
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3>Pure Meme Energy</h3>
              <p>No fancy mechanics, no complicated tokenomics - just pure, unadulterated meme power and community vibes.</p>
            </Card>
            <Card
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Digital Treasure Hunt</h3>
              <p>Explore the website, decode the clues, and join the race to uncover the secrets hidden within the code.</p>
            </Card>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Join the Revolution</SectionTitle>
          <SectionText>
            This isn't just another memecoin – it's a digital treasure hunt waiting to be solved.
            The developer wallet is hidden somewhere in this website, waiting for the worthy to discover it.
            Will you be the one to crack the code and claim your share of the power?
            Join us in this epic quest, where memes meet mystery, and every visitor could become a developer.
          </SectionText>
          <Grid>
            <Card
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>The Hunt is On</h3>
              <p>Explore every corner of the website. The developer wallet access could be anywhere – in the code, in the visuals, or hidden in plain sight.</p>
            </Card>
            <Card
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3>Community Power</h3>
              <p>No VCs, no private sales, no complicated tokenomics. Just pure meme energy and a chance for anyone to become part of the developer team.</p>
            </Card>
          </Grid>
          <div style={{ marginTop: '2rem' }}>
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={walletAddress ? disconnectWallet : connectWallet}
            >
              {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
            </CTAButton>
            {walletAddress && (
              <SectionText style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              </SectionText>
            )}
          </div>
        </Section>
      </ContentContainer>

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalTitle>Identity Verification</ModalTitle>
              <ModalText>
                Welcome, {hackerName}. Your presence has been detected in the network.
                Confirm your identity to access the CyberCoin mainframe.
              </ModalText>
              <ButtonGroup>
                <CTAButton
                  onClick={confirmConnection}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm Identity
                </CTAButton>
                <CTAButton
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    background: 'transparent',
                    borderColor: ({ theme }) => theme.colors.error 
                  }}
                >
                  Abort
                </CTAButton>
              </ButtonGroup>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </ModalContent>
          </Modal>
        )}
        {showMatrixEntry && (
          <MatrixEntry onComplete={handleMatrixComplete} />
        )}
        {showCopyNotification && (
          <CopyNotification
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            CA Copied to Clipboard
          </CopyNotification>
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Home; 