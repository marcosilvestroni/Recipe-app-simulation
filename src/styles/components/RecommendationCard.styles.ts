import styled, { keyframes } from 'styled-components';

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const CardContainer = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-bottom: 2rem;
  animation: ${scaleIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    
    img {
      order: -1;
      height: 200px;
    }
  }
`;

export const RecipeTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--color-primary);
  margin: 0 0 1rem 0;
  line-height: 1.2;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: #eee;
  border-radius: 100px;
  font-size: 0.875rem;
  color: var(--color-text-light);
  font-weight: 500;
`;

export const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const Description = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--color-text-light);
`;

export const RecipeImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

export const FeedbackSection = styled.div`
  padding: 2rem;
  background: #fafafa;
  border-radius: var(--radius-md);
  text-align: center;
`;

export const FeedbackButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
