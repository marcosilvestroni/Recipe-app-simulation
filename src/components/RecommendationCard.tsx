import React from 'react';
import type { Recipe } from '../types';
import { Button, Heading } from '../styles/shared';
import {
  CardContainer,
  ContentGrid,
  RecipeTitle,
  Tag,
  TagsContainer,
  Description,
  RecipeImage,
  FeedbackSection,
  FeedbackButtons
} from '../styles/components/RecommendationCard.styles';


interface RecommendationCardProps {
  recipe: Recipe;
  onNewIdea: () => void;
  onFeedback: (liked: boolean) => void;
  isLoading?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recipe,
  onNewIdea,
  onFeedback,
  isLoading
}) => {
  return (
    <CardContainer>
      <Heading style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>We found a match!</Heading>
      <ContentGrid>
        <div>
          <RecipeTitle>{recipe.strMeal}</RecipeTitle>
          <TagsContainer>
            <Tag>{recipe.strArea}</Tag>
            <Tag>{recipe.strCategory}</Tag>
          </TagsContainer>
          <Description>
            {recipe.strInstructions?.slice(0, 250)}...
          </Description>
          {recipe.strYoutube && (
            <Button as="a" href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" $variant="primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              View Recipe
            </Button>
          )}
        </div>
        <div>
          <RecipeImage src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
      </ContentGrid>

      <FeedbackSection>
        <h3 style={{marginBottom: '1rem', color: 'var(--color-text-light)'}}>Did you like this recommendation?</h3>
        <FeedbackButtons>
          <Button $variant="outline" onClick={() => onFeedback(true)} disabled={isLoading}>
            👍 Yes, I like it
          </Button>
          <Button $variant="outline" onClick={() => onFeedback(false)} disabled={isLoading}>
            👎 No, not for me
          </Button>
        </FeedbackButtons>
        <Button $variant="secondary" onClick={onNewIdea} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Give me another idea'}
        </Button>
      </FeedbackSection>
    </CardContainer>
  );
};
