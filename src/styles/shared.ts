import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Card = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  
  ${props => props.$variant === 'primary' && `
    background-color: var(--color-primary);
    color: white;
    &:hover { background-color: var(--color-primary-dark); }
    &:disabled { background-color: #ccc; cursor: not-allowed; }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    &:hover { background-color: rgba(255, 107, 107, 0.1); }
  `}

  ${props => (!props.$variant || props.$variant === 'outline') && `
    background: transparent;
    border: 1px solid #ddd;
    color: var(--color-text);
    &:hover { border-color: var(--color-text); }
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--radius-md);
  font-size: 1rem;
  margin-top: 0.5rem;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`;

export const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
`;

export const Subheading = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin: 0 0 2rem 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;
