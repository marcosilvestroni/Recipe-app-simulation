import React from 'react';
import type { HistoryItem } from '../types';
import { Heading } from '../styles/shared';
import {
  HistoryGrid,
  HistoryCard,
  HistoryHeader,
  Thumbnail,
  MetaInfo,
  Title
} from '../styles/components/HistoryList.styles';


interface HistoryListProps {
  history: HistoryItem[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: '4rem' }}>
      <Heading style={{ fontSize: '1.75rem' }}>History</Heading>
      <HistoryGrid>
        {history.map((item) => (
          <HistoryCard key={item.id}>
            <HistoryHeader>
               <Thumbnail src={item.image} alt={item.title} />
               <div style={{ flex: 1, minWidth: 0 }}>
                 <Title>{item.title}</Title>
                 <small style={{ color: 'var(--color-text-light)' }}>
                   {new Date(item.timestamp).toLocaleDateString()}
                 </small>
               </div>
               <span style={{ fontSize: '1.25rem' }}>
                 {item.liked ? '👍' : '👎'}
               </span>
            </HistoryHeader>
            <MetaInfo>
                {item.preferences.area} • {item.preferences.categoryOrIngredient}
            </MetaInfo>
          </HistoryCard>
        ))}
      </HistoryGrid>
    </div>
  );
};
