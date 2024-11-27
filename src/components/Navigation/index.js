import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatabase, ref, onValue } from 'firebase/database';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}33;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.primary)};
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    text-shadow: ${({ theme }) => theme.shadows.neon(theme.colors.accent)};
  }
`;

const OnlineCounter = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(10, 10, 10, 0.98);
  padding: 5rem 2rem;
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text};
  text-shadow: ${({ theme, $active }) => $active ? theme.shadows.neon(theme.colors.primary) : 'none'};
  font-weight: ${({ $active }) => $active ? '700' : '400'};
  
  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(${({ $active }) => $active ? 1 : 0});
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const Navigation = ({ onDisconnect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const walletsRef = ref(db, 'wallets');

    const unsubscribe = onValue(walletsRef, (snapshot) => {
      if (snapshot.exists()) {
        let count = 0;
        snapshot.forEach((childSnapshot) => {
          const wallet = childSnapshot.val();
          if (wallet.online === true) {
            count++;
          }
        });
        setOnlineCount(count);
      }
    });

    return () => unsubscribe();
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/lore', label: 'Lore' },
    { to: '/features', label: 'Features' },
    { to: '/team', label: 'Team' },
    { to: '/games', label: 'Games' }
  ];

  return (
    <Nav style={{ 
      background: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
    }}>
      <NavContainer>
        <OnlineCounter>
          Devs Online: {onlineCount}
        </OnlineCounter>
        <Logo to="/">CyberCoin</Logo>
        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '×' : '☰'}
        </MenuButton>
        <NavLinks>
          {links.map(({ to, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              $active={location.pathname === to}
            >
              {label}
            </NavLink>
          ))}
        </NavLinks>
        <AnimatePresence>
          {isOpen && (
            <MobileMenu
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  $active={location.pathname === to}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContainer>
    </Nav>
  );
};

export default Navigation; 