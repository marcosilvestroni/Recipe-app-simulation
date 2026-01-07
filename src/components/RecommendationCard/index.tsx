import React, { useCallback, useEffect, useState } from "react";
import type { Recipe } from "../../types";
import { Button, Heading } from "../../styles/shared";
import {
  useLazyGetRecipesByAreaQuery,
  useLazyGetRecipesByCategoryQuery,
  useLazyGetRecipesByIngredientQuery,
  useLazyLookupRecipeQuery,
} from "../../api/recipeApi";
import type { HistoryItem } from "../../types";
import { STORAGE_KEY_HISTORY, HISTORY_UPDATED_EVENT } from "../../constants";

import {
  CardContainer,
  ContentGrid,
  RecipeTitle,
  Tag,
  TagsContainer,
  Description,
  RecipeImage,
  FeedbackSection,
  FeedbackButtons,
} from "./styles";

interface RecommendationCardProps {
  preferences: {
    area: string;
    categoryOrIngredient: string;
    strategy: "category" | "ingredient";
  };
  onReset: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  preferences,
  onReset,
}) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // RTK Query hooks
  const [triggerArea] = useLazyGetRecipesByAreaQuery();
  const [triggerCategory] = useLazyGetRecipesByCategoryQuery();
  const [triggerIngredient] = useLazyGetRecipesByIngredientQuery();
  const [triggerLookup] = useLazyLookupRecipeQuery();

  const getRecommendation = useCallback(async () => {
    setIsLoading(true);
    setRecipe(null); // Clear previous while loading? Optional.
    setNoResults(false);
    try {
      const { data: areaRecipes = [] } = await triggerArea(preferences.area);
      let secondSet: Recipe[] = [];

      if (preferences.strategy === "category") {
        const { data } = await triggerCategory(
          preferences.categoryOrIngredient
        );
        secondSet = data || [];
      } else {
        const { data } = await triggerIngredient(
          preferences.categoryOrIngredient
        );
        secondSet = data || [];
      }

      // Intersect
      const intersection = areaRecipes.filter((r1) =>
        secondSet.some((r2) => r2.idMeal === r1.idMeal)
      );

      if (intersection.length === 0) {
        setNoResults(true);
        setIsLoading(false);
        return;
      }

      const random =
        intersection[Math.floor(Math.random() * intersection.length)];

      // Fetch full details
      const { data: fullRecipe } = await triggerLookup(random.idMeal);

      if (fullRecipe) {
        setRecipe(fullRecipe);
      }
    } catch (e) {
      console.error(e);
      // Fallback or just stay in loading?
      // Ideally show error state but for now let's just stop loading.
    } finally {
      setIsLoading(false);
    }
  }, [
    preferences,
    triggerArea,
    triggerCategory,
    triggerIngredient,
    triggerLookup,
  ]);

  // Initial fetch
  useEffect(() => {
    getRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount/preferences change if we want? Logic says when step 3 mounts.

  const handleFeedback = (liked: boolean) => {
    if (!recipe) return;

    // Save to history
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      recipeId: recipe.idMeal,
      title: recipe.strMeal,
      image: recipe.strMealThumb,
      timestamp: Date.now(),
      liked,
      preferences: {
        area: preferences.area,
        categoryOrIngredient: preferences.categoryOrIngredient,
      },
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      const prev = stored ? JSON.parse(stored) : [];
      const next = [newItem, ...prev];
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));

      window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
    } catch (e) {
      console.error("Failed to save history", e);
    }

    getRecommendation();
  };

  if (isLoading) {
    return (
      <CardContainer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Heading>Findind the perfect meal...</Heading>
      </CardContainer>
    );
  }

  if (noResults) {
    return (
      <CardContainer style={{ textAlign: "center", padding: "3rem" }}>
        <Heading style={{ marginBottom: "1rem" }}>No Matches Found</Heading>
        <Description style={{ marginBottom: "2rem" }}>
          We couldn't find any {preferences.area} recipes that match your
          criteria. Try changing your {preferences.strategy} selection.
        </Description>
        <Button $variant="primary" onClick={onReset}>
          Adjust Preferences
        </Button>
      </CardContainer>
    );
  }

  if (!recipe) return null; // Should not happen if loading handled correctly

  return (
    <CardContainer>
      <Heading style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        We found a match!
      </Heading>
      <ContentGrid>
        <div>
          <RecipeTitle>{recipe.strMeal}</RecipeTitle>
          <TagsContainer>
            <Tag>{recipe.strArea}</Tag>
            <Tag>{recipe.strCategory}</Tag>
          </TagsContainer>
          <Description>{recipe.strInstructions?.slice(0, 250)}...</Description>
          {recipe.strYoutube && (
            <Button
              as="a"
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              $variant="primary"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              View Recipe
            </Button>
          )}
        </div>
        <div>
          <RecipeImage src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
      </ContentGrid>

      <FeedbackSection>
        <h3 style={{ marginBottom: "1rem", color: "var(--color-text-light)" }}>
          Did you like this recommendation?
        </h3>
        <FeedbackButtons>
          <Button
            $variant="outline"
            onClick={() => handleFeedback(true)}
            disabled={isLoading}
          >
            👍 Yes, I like it
          </Button>
          <Button
            $variant="outline"
            onClick={() => handleFeedback(false)}
            disabled={isLoading}
          >
            👎 No, not for me
          </Button>
        </FeedbackButtons>
        <Button
          $variant="secondary"
          onClick={getRecommendation}
          disabled={isLoading}
        >
          {isLoading ? "Thinking..." : "Give me another idea"}
        </Button>
        <Button
          $variant="outline"
          onClick={onReset}
          disabled={isLoading}
          style={{ marginTop: "1rem" }}
        >
          Modify Selection
        </Button>
      </FeedbackSection>
    </CardContainer>
  );
};
