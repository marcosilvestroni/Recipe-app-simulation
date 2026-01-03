import React, { useState, useEffect, useCallback } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { GlobalStyle } from './styles/GlobalStyle';
import { Container } from './styles/shared';
import { StepWizard } from './components/StepWizard';
import { PreferenceForm } from './components/PreferenceForm';
import { RecommendationCard } from './components/RecommendationCard';
import { HistoryList } from './components/HistoryList';
import { HistoryItem, Recipe } from './types';
import { 
  useLazyGetRecipesByAreaQuery, 
  useLazyGetRecipesByCategoryQuery, 
  useLazyGetRecipesByIngredientQuery 
} from './api/recipeApi';

const STORAGE_KEY_HISTORY = 'recipe_app_history';

const RecipeApp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<{
    area: string;
    categoryOrIngredient: string;
    strategy: 'category' | 'ingredient';
  }>({
    area: '',
    categoryOrIngredient: '',
    strategy: 'category',
  });
  
  const [recommendation, setRecommendation] = useState<Recipe | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // RTK Query hooks
  const [triggerArea] = useLazyGetRecipesByAreaQuery();
  const [triggerCategory] = useLazyGetRecipesByCategoryQuery();
  const [triggerIngredient] = useLazyGetRecipesByIngredientQuery();

  const [isLoading, setIsLoading] = useState(false);

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const saveHistoryItem = (liked: boolean) => {
    if (!recommendation) return;
    
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      recipeId: recommendation.idMeal,
      title: recommendation.strMeal,
      image: recommendation.strMealThumb,
      timestamp: Date.now(),
      liked,
      preferences: {
        area: preferences.area,
        categoryOrIngredient: preferences.categoryOrIngredient
      }
    };
    
    setHistory(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      return next;
    });

    // Reset for new search or keep recommending?
    // Requirement says "display History section", implies staying on page or resetting.
    resetWizard(); 
  };
  
  const resetWizard = () => {
      setRecommendation(null);
      setStep(1);
      setPreferences({ area: '', categoryOrIngredient: '', strategy: 'category' });
  };

  const getRecommendation = async () => {
    setIsLoading(true);
    try {
      // 1. Get recipes by Area first to intersect? 
      // The API doesn't support easy intersection of Area AND Category directly without multiple calls.
      // Strategy: 
      // - Get list by Area
      // - Get list by Category/Ingredient
      // - Find intersection
      // - Pick random
      
      const { data: areaRecipes = [] } = await triggerArea(preferences.area);
      let secondSet: Recipe[] = [];
      
      if (preferences.strategy === 'category') {
        const { data } = await triggerCategory(preferences.categoryOrIngredient);
        secondSet = data || [];
      } else {
        const { data } = await triggerIngredient(preferences.categoryOrIngredient);
        secondSet = data || [];
      }
      
      // Intersect
      const intersection = areaRecipes.filter(r1 => secondSet.some(r2 => r2.idMeal === r1.idMeal));
      
      const candidates = intersection.length > 0 ? intersection : areaRecipes; // Fallback to area if strict match fails? Or empty?
      // Strict match is better UX for "recommender", but if empty handling is needed.
      // Let's assume strict for now.
      
      if (intersection.length === 0) {
        alert("No recipes found matching both criteria! Try a different combination.");
        setIsLoading(false);
        return;
      }
      
      const random = intersection[Math.floor(Math.random() * intersection.length)];
      
      // Need full details? The list endpoints only give ID, Title, Image.
      // If we need instructions/tags/youtube, we might need lookup. But the type says optional.
      // RecommendationCard uses instructions/youtube. So we fetch full details.
      
      // Actually we have a specific hook for lookup but we can just fetch fetchBaseQuery manually or use the api instance? 
      // Simplest is to just use the fetch in a useEffect or here manually if we exposed the endpoint.
      // Let's assume passed Recipe object needs hydration if details are missing. 
      // The list endpoint results only have strMeal, strMealThumb, idMeal. 
      // We NEED to fetch full details.
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${random.idMeal}`);
      const data = await response.json();
      if (data.meals && data.meals[0]) {
          setRecommendation(data.meals[0]);
          setStep(3); // Show result
      }
      
    } catch (e) {
      console.error(e);
      alert("Failed to fetch recommendation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', margin: 0 }}>RecipeMatcher</h1>
        <p style={{ color: 'var(--color-text-light)' }}>Find your next favorite meal in seconds.</p>
      </header>

      {step < 3 && (
        <StepWizard currentStep={step} totalSteps={2}>
           <PreferenceForm
             step={step}
             preferences={preferences}
             onUpdate={(updates) => setPreferences(prev => ({ ...prev, ...updates }))}
             onNext={() => {
               if (step === 1) setStep(2);
               else getRecommendation();
             }}
             onBack={() => setStep(step - 1)}
           />
        </StepWizard>
      )}

      {step === 3 && recommendation && (
        <RecommendationCard
          recipe={recommendation}
          onNewIdea={getRecommendation}
          onFeedback={saveHistoryItem}
          isLoading={isLoading}
        />
      )}
      
      <HistoryList history={history} />
    </Container>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <RecipeApp />
    </Provider>
  );
}
