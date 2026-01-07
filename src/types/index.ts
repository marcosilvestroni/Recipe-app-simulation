export interface Category {
  strCategory: string;
}

export interface Area {
  strArea: string;
}

export interface Ingredient {
  strIngredient: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube?: string;
  [key: string]: string | undefined; // For dynamic ingredient/measure keys
}

export interface HistoryItem {
  id: string; // unique ID for history entry
  recipeId: string;
  title: string;
  image: string;
  timestamp: number;
  liked: boolean;
  preferences: {
    area: string;
    categoryOrIngredient: string;
  };
}

export interface RecommendationRequest {
  area: string;
  categoryOrIngredient: string;
  strategy: "category" | "ingredient";
}
