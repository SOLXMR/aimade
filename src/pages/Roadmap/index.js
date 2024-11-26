import React from 'react';
import styled from 'styled-components';

const RoadmapContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
`;

const Roadmap = () => {
  return (
    <RoadmapContainer>
      <h1>Roadmap</h1>
      <p>Coming soon...</p>
    </RoadmapContainer>
  );
};

export default Roadmap; 