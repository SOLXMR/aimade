import React from 'react';
import styled from 'styled-components';
import MatrixRain from './MatrixRain';

const WalletGateContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
`;

const HackerContainer = styled.div`
  border: 2px solid #00ff00;
  background: rgba(0, 20, 0, 0.8);
  padding: 3rem;
  position: relative;
  max-width: 90vw;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #00ff00;
  }

  &::before {
    top: -10px;
    left: -10px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: -10px;
    right: -10px;
    border-left: none;
    border-top: none;
  }
`;

const MatrixText = styled.h1`
  font-size: 5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
  font-family: 'Courier New', monospace;
  
  @media (max-width: 1200px) {
    font-size: 4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ConnectButton = styled.button`
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 3rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00);
    animation: btn-line 3s linear infinite;
  }

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }

  @keyframes btn-line {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const WalletGate = ({ onConnect }) => {
  const connectWallet = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await window.solana.connect();
      onConnect(response.publicKey.toString());
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <WalletGateContainer>
      <MatrixRain />
      <HackerContainer>
        <MatrixText>
          Connect Phantom Wallet<br />
          to enter<br />
          the MATRIX
        </MatrixText>
        <ButtonWrapper>
          <ConnectButton onClick={connectWallet}>
            Connect Wallet
          </ConnectButton>
        </ButtonWrapper>
      </HackerContainer>
    </WalletGateContainer>
  );
};

export default WalletGate; 