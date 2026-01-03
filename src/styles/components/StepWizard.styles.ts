import styled from 'styled-components';

export const WizardContainer = styled.div`
  width: 100%;
`;

export const ProgressBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const ProgressStep = styled.div<{ $active: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.$active ? 'var(--color-primary)' : '#ddd'};
  transition: background 0.3s ease;
`;
