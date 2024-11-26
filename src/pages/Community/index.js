import React from 'react';
import styled from 'styled-components';

const CommunityContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
`;

const Community = () => {
  return (
    <CommunityContainer>
      <h1>Community</h1>
      <p>Coming soon...</p>
    </CommunityContainer>
  );
};

export default Community; 