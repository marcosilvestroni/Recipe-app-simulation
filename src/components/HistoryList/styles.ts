import styled from 'styled-components';
import { Card } from '../../styles/shared';

export const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const HistoryCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Thumbnail = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const MetaInfo = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-light);
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
