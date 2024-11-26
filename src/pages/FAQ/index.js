import React from 'react';
import styled from 'styled-components';

const FAQContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
`;

const FAQ = () => {
  return (
    <FAQContainer>
      <h1>FAQ</h1>
      <p>Coming soon...</p>
    </FAQContainer>
  );
};

export default FAQ; 