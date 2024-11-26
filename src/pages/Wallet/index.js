import React, { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { motion } from 'framer-motion';

const WalletContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
`;

const WalletCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 2rem;
  border-radius: 4px;
  margin-bottom: 2rem;

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

const WalletButton = styled(motion.button)`
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

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

const WalletInfo = styled.div`
  margin: 2rem 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const WalletAddress = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.mono};
  padding: 1rem;
  background: ${({ theme }) => theme.colors.darkGray};
  border-radius: 4px;
  margin: 1rem 0;
  word-break: break-all;
`;

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 1rem;
`;

const Wallet = () => {
  const theme = useContext(ThemeContext);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState('');

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
      
      // Request connection to wallet
      const resp = await provider.connect();
      
      // Get the public key
      const publicKey = resp.publicKey.toString();
      
      // Store the public key
      setWalletAddress(publicKey);
      
      console.log('Connected to wallet:', publicKey);
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

  return (
    <WalletContainer>
      <ContentWrapper>
        <Title>Quantum Wallet Interface</Title>
        <WalletCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {!walletAddress ? (
            <>
              <WalletInfo>
                Connect your Phantom wallet to access the CyberCoin network
              </WalletInfo>
              <WalletButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
              >
                Initialize Connection
              </WalletButton>
            </>
          ) : (
            <>
              <WalletInfo>
                Neural link established
              </WalletInfo>
              <WalletAddress>
                {walletAddress}
              </WalletAddress>
              <WalletButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
              >
                Terminate Connection
              </WalletButton>
            </>
          )}
          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
        </WalletCard>
      </ContentWrapper>
    </WalletContainer>
  );
};

export default Wallet; 