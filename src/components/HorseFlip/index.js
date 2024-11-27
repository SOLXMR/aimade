import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import './HorseFlip.css';

// Add Buffer polyfill
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const NETWORK = 'mainnet-beta';
const CONNECTION = new Connection(
  'https://misty-dimensional-film.solana-mainnet.quiknode.pro/a3fd984b10004b15fa8782cc8801d1fddf39cf40',
  'confirmed'
);

// Fallback RPC endpoints if needed
const BACKUP_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana'
];

const LAMPORTS_PER_SOL = 1000000000;
const HOUSE_WALLET = new PublicKey('3cGdQrByDGxAweqbngWrmV5gU7Z6K1U3p2TLpx9nQw6d');

// Sound effects with fallback URLs
const SOUND_EFFECTS = {
  win: 'https://assets.mixkit.co/active_storage/sfx/2017/win-game-classic-arcade.wav',
  lose: 'https://assets.mixkit.co/active_storage/sfx/2020/game-over-arcade.wav',
  flip: 'https://assets.mixkit.co/active_storage/sfx/2571/coin-flip-magic.wav',
  button: 'https://assets.mixkit.co/active_storage/sfx/1567/click-button.wav',
  connect: 'https://assets.mixkit.co/active_storage/sfx/2018/success-game-notification.wav'
};

// Matrix-style messages
const WIN_MESSAGES = [
  "SYSTEM BREACH SUCCESSFUL",
  "MATRIX HACK COMPLETE",
  "REALITY MANIPULATION SUCCESS",
  "PROTOCOL OVERRIDE: WIN",
  "SYSTEM EXPLOITED"
];

const LOSE_MESSAGES = [
  "YOU LOST BETTER LUCK NEXT TIME",
  "HACK ATTEMPT FAILED",
  "YOU LOST BETTER LUCK NEXT TIME",
  "PROTOCOL OVERRIDE: FAIL",
  "YOU LOST BETTER LUCK NEXT TIME"
];

const SIDES = {
  heads: { emoji: '👾', name: 'ALIEN' },
  tails: { emoji: '🤖', name: 'ROBOT' }
};

const HorseFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState(0.1);
  const [balance, setBalance] = useState(0);
  const [selectedSide, setSelectedSide] = useState('heads');
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [message, setMessage] = useState('');
  const [showGlitch, setShowGlitch] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sounds, setSounds] = useState({});
  const [isFirstFlip, setIsFirstFlip] = useState(true);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(SIDES.heads.emoji);

  useEffect(() => {
    if ('solana' in window) {
      setProvider(window.solana);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      updateBalance();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      updateBalance();
      const balanceInterval = setInterval(updateBalance, 5000);
      return () => clearInterval(balanceInterval);
    }
  }, [walletAddress]);

  // Initialize audio with error handling
  useEffect(() => {
    const loadedSounds = {};
    Object.entries(SOUND_EFFECTS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.5; // 50% volume
      loadedSounds[key] = audio;
    });
    setSounds(loadedSounds);
  }, []);

  // Safe play function
  const playSound = (soundName) => {
    if (!audioEnabled || !sounds[soundName]) return;
    
    const sound = sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(err => {
      console.log(`Sound play failed: ${err.message}`);
      // If sound fails, disable audio to prevent further errors
      if (err.name === 'NotSupportedError') {
        setAudioEnabled(false);
      }
    });
  };

  // Enhanced connect wallet function
  const connectWallet = async () => {
    try {
      if (!provider) {
        setMessage("ERROR: PHANTOM WALLET NOT DETECTED");
        return;
      }
      playSound('connect');
      setMessage("INITIATING WALLET CONNECTION...");
      const resp = await provider.connect();
      setWalletAddress(resp.publicKey.toString());
      
      const balance = await CONNECTION.getBalance(resp.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
      setMessage("WALLET CONNECTION ESTABLISHED");
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setMessage("CONNECTION FAILED: MAINNET REQUIRED");
    }
  };

  const updateBalance = async () => {
    try {
      const balance = await CONNECTION.getBalance(new PublicKey(walletAddress));
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const getFlipResult = (betAmount, selectedSide) => {
    if (isFirstFlip) {
      return selectedSide === 'heads' ? 'tails' : 'heads';
    }
    const winProbability = betAmount >= 1 ? 0.2 : 0.3;
    const random = Math.random();
    const playerWins = random < winProbability;
    return playerWins ? selectedSide : (selectedSide === 'heads' ? 'tails' : 'heads');
  };

  // Enhanced flip function
  const flip = async () => {
    if (!walletAddress) {
      setMessage("ERROR: WALLET CONNECTION REQUIRED");
      return;
    }

    try {
      const transactionFee = 0.000005 * LAMPORTS_PER_SOL;
      const totalNeeded = (betAmount * LAMPORTS_PER_SOL) + transactionFee;
      const currentBalance = await CONNECTION.getBalance(new PublicKey(walletAddress));

      if (currentBalance < totalNeeded) {
        setMessage("ERROR: INSUFFICIENT FUNDS");
        return;
      }

      setIsFlipping(true);
      setIsTransactionPending(true);
      setShowGlitch(true);
      playSound('flip');
      setMessage("INITIATING QUANTUM FLIP...");

      const transaction = new Transaction();
      const playerWallet = new PublicKey(walletAddress);
      
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: playerWallet,
        toPubkey: HOUSE_WALLET,
        lamports: Math.floor(betAmount * LAMPORTS_PER_SOL)
      });

      transaction.add(transferInstruction);
      const { blockhash } = await CONNECTION.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = playerWallet;

      const signed = await provider.signTransaction(transaction);
      const signature = await CONNECTION.sendRawTransaction(signed.serialize());
      await CONNECTION.confirmTransaction(signature);

      setTimeout(() => {
        const flipResult = getFlipResult(betAmount, selectedSide);
        setResult(flipResult);
        setIsFlipping(false);
        setIsFirstFlip(false);
        
        if (flipResult === selectedSide) {
          playSound('win');
          setMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
        } else {
          playSound('lose');
          setMessage(LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)]);
        }
        
        setShowGlitch(false);
        setIsTransactionPending(false);
        updateBalance();
      }, 2000);

    } catch (err) {
      console.error('Error processing bet:', err);
      setMessage("TRANSACTION FAILED: " + err.message);
      setIsFlipping(false);
      setIsTransactionPending(false);
      setShowGlitch(false);
    }
  };

  const increaseBet = () => {
    setBetAmount(prev => {
      const newAmount = prev + 0.1;
      return parseFloat(Math.min(newAmount, balance || 0).toFixed(1));
    });
  };

  const decreaseBet = () => {
    setBetAmount(prev => {
      const newAmount = prev - 0.1;
      return parseFloat(Math.max(0.1, newAmount).toFixed(1));
    });
  };

  const handleBetInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const newAmount = Math.max(0.1, Math.min(value, balance || 0));
      setBetAmount(parseFloat(newAmount.toFixed(1)));
    }
  };

  const handleSideSelect = (side) => {
    playSound('button');
    setSelectedSide(side);
    setCurrentEmoji(SIDES[side].emoji);
  };

  // Update button click handlers
  const handleButtonClick = (action) => {
    playSound('button');
    action();
  };

  return (
    <div className="container">
      <h1 className={showGlitch ? 'glitch' : ''}>Test Your Luck in the Matrix</h1>
      
      {message && <div className="message-overlay">{message}</div>}
      
      {!walletAddress ? (
        <button className="connect-button" onClick={() => handleButtonClick(connectWallet)}>
          <span className="hack-text">INITIALIZE CONNECTION</span>
        </button>
      ) : (
        <>
          <div className="wallet-info">
            <div className="address">CONNECTED: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</div>
            <div className="balance-display">
              BALANCE: {balance.toFixed(4)} <span className="sol-text">SOL</span>
            </div>
          </div>

          <div className={`coin-container ${showGlitch ? 'glitch' : ''}`}>
            <div className={`coin ${isTransactionPending ? 'continuous-flip' : isFlipping ? 'flipping' : ''} ${result ? result : ''}`}>
              <div className="side heads">{currentEmoji}</div>
              <div className="side tails">{currentEmoji === SIDES.heads.emoji ? SIDES.tails.emoji : SIDES.heads.emoji}</div>
            </div>
          </div>

          <div className="controls">
            <div className="bet-controls">
              <button onClick={() => handleButtonClick(decreaseBet)}>-</button>
              <input 
                type="number" 
                value={betAmount.toFixed(1)}
                onChange={handleBetInputChange}
                step="0.1"
                min="0.1"
                max={balance}
                className="matrix-input"
              />
              <button onClick={() => handleButtonClick(increaseBet)}>+</button>
            </div>

            <div className="side-selection">
              <button 
                onClick={() => handleSideSelect('heads')}
                className={selectedSide === 'heads' ? 'selected' : ''}
              >
                <span className="emoji">{SIDES.heads.emoji}</span> {SIDES.heads.name}
              </button>
              <button 
                onClick={() => handleSideSelect('tails')}
                className={selectedSide === 'tails' ? 'selected' : ''}
              >
                <span className="emoji">{SIDES.tails.emoji}</span> {SIDES.tails.name}
              </button>
            </div>

            <button 
              className={`flip-button ${isFlipping ? 'flipping' : ''}`}
              onClick={() => handleButtonClick(flip)}
              disabled={isFlipping || !walletAddress || betAmount <= 0}
            >
              <span className="hack-text">EXECUTE FLIP</span>
            </button>
          </div>
        </>
      )}

      {result && (
        <div className={`result ${result === selectedSide ? 'win' : 'lose'} ${showGlitch ? 'glitch' : ''}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default HorseFlip; 