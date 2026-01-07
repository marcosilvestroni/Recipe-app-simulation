import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Area, Category, Ingredient, Recipe } from "../types";

interface ListResponse<T> {
  meals: T[];
}

export const recipeApi = createApi({
  reducerPath: "recipeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.themealdb.com/api/json/v1/1/",
  }),
  endpoints: (builder) => ({
    getAreas: builder.query<Area[], void>({
      query: () => "list.php?a=list",
      transformResponse: (response: ListResponse<Area>) => response.meals || [],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => "list.php?c=list",
      transformResponse: (response: ListResponse<Category>) =>
        response.meals || [],
    }),
    getIngredients: builder.query<Ingredient[], void>({
      query: () => "list.php?i=list",
      transformResponse: (response: ListResponse<Ingredient>) =>
        response.meals || [],
    }),
    getRecipesByArea: builder.query<Recipe[], string>({
      query: (area) => `filter.php?a=${area}`,
      transformResponse: (response: ListResponse<Recipe>) =>
        response.meals || [],
    }),
    getRecipesByCategory: builder.query<Recipe[], string>({
      query: (category) => `filter.php?c=${category}`,
      transformResponse: (response: ListResponse<Recipe>) =>
        response.meals || [],
    }),
    getRecipesByIngredient: builder.query<Recipe[], string>({
      query: (ingredient) => `filter.php?i=${ingredient}`,
      transformResponse: (response: ListResponse<Recipe>) =>
        response.meals || [],
    }),
    searchRecipes: builder.query<Recipe[], string>({
      query: (term) => `search.php?s=${term}`,
      transformResponse: (response: ListResponse<Recipe>) =>
        response.meals || [],
    }),
    lookupRecipe: builder.query<Recipe | null, string>({
      query: (id) => `lookup.php?i=${id}`,
      transformResponse: (response: ListResponse<Recipe>) =>
        response.meals && response.meals.length > 0 ? response.meals[0] : null,
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetCategoriesQuery,
  useGetIngredientsQuery,
  useSearchRecipesQuery,
  useLazyLookupRecipeQuery,
  useLazyGetRecipesByAreaQuery,
  useLazyGetRecipesByCategoryQuery,
  useLazyGetRecipesByIngredientQuery,
} = recipeApi;
