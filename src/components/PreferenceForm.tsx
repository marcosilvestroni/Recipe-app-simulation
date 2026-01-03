import React, { useState, useEffect } from 'react';
import { 
  useGetAreasQuery, 
  useGetCategoriesQuery, 
  useGetIngredientsQuery 
} from '../api/recipeApi';
import { Button, Grid, Heading, Input, Subheading } from '../styles/shared';
import { 
  FormContainer, 
  ButtonGroup, 
  ToggleLabel, 
  SuggestionsList, 
  SuggestionItem, 
  SearchContainer 
} from '../styles/components/PreferenceForm.styles';


interface PreferenceFormProps {
  step: number;
  preferences: {
    area: string;
    categoryOrIngredient: string;
    strategy: 'category' | 'ingredient';
  };
  onUpdate: (updates: Partial<{
    area: string;
    categoryOrIngredient: string;
    strategy: 'category' | 'ingredient';
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({
  step,
  preferences,
  onUpdate,
  onNext,
  onBack,
}) => {
  const { data: areas = [] } = useGetAreasQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const [ingredientTerm, setIngredientTerm] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState<typeof ingredients>([]);

  // Filter ingredients locally
  useEffect(() => {
    if (ingredientTerm.trim() === '') {
      setFilteredIngredients([]);
      return;
    }
    const term = ingredientTerm.toLowerCase();
    const matches = ingredients
      .filter((i) => i.strIngredient.toLowerCase().includes(term))
      .slice(0, 10);
    setFilteredIngredients(matches);
  }, [ingredientTerm, ingredients]);

  // Sync internal state if coming back
  useEffect(() => {
    if (preferences.strategy === 'ingredient' && preferences.categoryOrIngredient) {
      setIngredientTerm(preferences.categoryOrIngredient);
    }
  }, [preferences.strategy, preferences.categoryOrIngredient]);


  if (step === 1) {
    return (
      <FormContainer>
        <Heading>Where would you like to eat?</Heading>
        <Subheading>Select a cuisine style or region.</Subheading>
        
        <Grid>
          {areas.map((area) => (
            <Button
              key={area.strArea}
              $variant={preferences.area === area.strArea ? 'primary' : 'outline'}
              onClick={() => onUpdate({ area: area.strArea })}
            >
              {area.strArea}
            </Button>
          ))}
        </Grid>

        <ButtonGroup>
          <Button
            $variant="primary"
            disabled={!preferences.area}
            onClick={onNext}
          >
            Next Step
          </Button>
        </ButtonGroup>
      </FormContainer>
    );
  }

  if (step === 2) {
    return (
      <FormContainer>
        <Heading>What are you in the mood for?</Heading>
        <Subheading>Choose a main ingredient or category.</Subheading>

        <div style={{ marginBottom: '2rem' }}>
          <ToggleLabel>
             <input
              type="radio"
              checked={preferences.strategy === 'category'}
              onChange={() => onUpdate({ strategy: 'category', categoryOrIngredient: '' })}
            /> Category
          </ToggleLabel>
          <ToggleLabel>
            <input
              type="radio"
              checked={preferences.strategy === 'ingredient'}
              onChange={() => onUpdate({ strategy: 'ingredient', categoryOrIngredient: '' })}
            /> Main Ingredient
          </ToggleLabel>
        </div>

        {preferences.strategy === 'category' ? (
           <Grid>
           {categories.map((cat) => (
             <Button
               key={cat.strCategory}
               $variant={preferences.categoryOrIngredient === cat.strCategory ? 'primary' : 'outline'}
               onClick={() => onUpdate({ categoryOrIngredient: cat.strCategory })}
             >
               {cat.strCategory}
             </Button>
           ))}
         </Grid>
        ) : (
          <SearchContainer>
            <label htmlFor="ingredient-search" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>
              Search Ingredient (e.g., Chicken, Garlic):
            </label>
            <Input
              id="ingredient-search"
              value={ingredientTerm}
              onChange={(e) => {
                setIngredientTerm(e.target.value);
                if (preferences.categoryOrIngredient !== e.target.value) {
                    onUpdate({ categoryOrIngredient: '' }); 
                }
              }}
              placeholder="Type to search..."
              autoComplete="off"
            />
            {filteredIngredients.length > 0 && !preferences.categoryOrIngredient && (
              <SuggestionsList>
                {filteredIngredients.map((ing) => (
                  <SuggestionItem
                    key={ing.strIngredient}
                    onClick={() => {
                        onUpdate({ categoryOrIngredient: ing.strIngredient });
                        setIngredientTerm(ing.strIngredient);
                        setFilteredIngredients([]);
                    }}
                  >
                    {ing.strIngredient}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
            )}
          </SearchContainer>
        )}

        <ButtonGroup className="space-between">
          <Button $variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            $variant="primary"
            disabled={!preferences.categoryOrIngredient}
            onClick={onNext}
          >
            Find Recipe
          </Button>
        </ButtonGroup>
      </FormContainer>
    );
  }

  return null;
};
