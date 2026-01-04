import { render, screen, fireEvent } from '@testing-library/react';
import { RecommendationCard } from '../RecommendationCard';
import type { Recipe } from '../../types';
import { describe, it, expect, vi } from 'vitest';

const mockRecipe: Recipe = {
  idMeal: '12345',
  strMeal: 'Test Pasta',
  strMealThumb: 'https://example.com/image.jpg',
  strCategory: 'Pasta',
  strArea: 'Italian',
  strInstructions: 'Boil water. Cook pasta. Eat.',
  strYoutube: 'https://youtube.com/watch?v=123',
};

describe('RecommendationCard', () => {
  it('renders recipe details correctly', () => {
    const onNewIdea = vi.fn();
    const onFeedback = vi.fn();

    render(
      <RecommendationCard
        recipe={mockRecipe}
        onNewIdea={onNewIdea}
        onFeedback={onFeedback}
      />
    );

    expect(screen.getByText('Test Pasta')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText(/Boil water/)).toBeInTheDocument();
  });

  it('calls feedback handlers', () => {
    const onNewIdea = vi.fn();
    const onFeedback = vi.fn();

    render(
      <RecommendationCard
        recipe={mockRecipe}
        onNewIdea={onNewIdea}
        onFeedback={onFeedback}
      />
    );

    fireEvent.click(screen.getByText(/Yes, I like it/i));
    expect(onFeedback).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByText(/No, not for me/i));
    expect(onFeedback).toHaveBeenCalledWith(false);
  });
});
