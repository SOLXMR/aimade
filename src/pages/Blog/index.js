import React from 'react';
import styled from 'styled-components';

const BlogContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: ${({ theme }) => theme.colors.background};
`;

const Blog = () => {
  return (
    <BlogContainer>
      <h1>Blog</h1>
      <p>Coming soon...</p>
    </BlogContainer>
  );
};

export default Blog; 