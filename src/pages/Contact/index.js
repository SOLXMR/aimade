import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
`;

const Contact = () => {
  return (
    <ContactContainer>
      <h1>Contact</h1>
      <p>Coming soon...</p>
    </ContactContainer>
  );
};

export default Contact; 