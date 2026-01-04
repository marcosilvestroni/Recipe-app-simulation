import React, { useEffect, useState } from 'react';
import type { HistoryItem } from '../types';
import { Heading } from '../styles/shared';
import { STORAGE_KEY_HISTORY, HISTORY_UPDATED_EVENT } from '../constants';
import {
  HistoryGrid,
  HistoryCard,
  HistoryHeader,
  Thumbnail,
  MetaInfo,
  Title
} from '../styles/components/HistoryList.styles';


export const HistoryList: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load history', e);
      return [];
    }
  });

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  useEffect(() => {
    const handleUpdate = () => loadHistory();
    window.addEventListener(HISTORY_UPDATED_EVENT, handleUpdate);
    
    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, handleUpdate);
    };
  }, []);

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
