import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecommendationCard } from "./index";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock API hooks
const useLazyGetRecipesByAreaQueryMock = vi.fn();
const useLazyGetRecipesByCategoryQueryMock = vi.fn();
const useLazyGetRecipesByIngredientQueryMock = vi.fn();
const useLazyLookupRecipeQueryMock = vi.fn();

vi.mock("../../api/recipeApi", () => ({
  useLazyGetRecipesByAreaQuery: () => [useLazyGetRecipesByAreaQueryMock],
  useLazyGetRecipesByCategoryQuery: () => [
    useLazyGetRecipesByCategoryQueryMock,
  ],
  useLazyGetRecipesByIngredientQuery: () => [
    useLazyGetRecipesByIngredientQueryMock,
  ],
  useLazyLookupRecipeQuery: () => [useLazyLookupRecipeQueryMock],
}));

// Mock fetch removal
// global.fetch = vi.fn();

describe("RecommendationCard", () => {
  const mockPreferences = {
    area: "Italian",
    categoryOrIngredient: "Pasta",
    strategy: "category" as const,
  };

  const mockAreaRecipes = [
    { idMeal: "1", strMeal: "Pasta 1" },
    { idMeal: "2", strMeal: "Pasta 2" },
  ];
  const mockCategoryRecipes = [{ idMeal: "1", strMeal: "Pasta 1" }]; // Intersection is ID 1
  const mockRecipeDetails = {
    idMeal: "1",
    strMeal: "Pasta 1",
    strMealThumb: "img.jpg",
    strArea: "Italian",
    strCategory: "Pasta",
    strInstructions: "Cook it",
    strYoutube: "youtube.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default successful intersection
    useLazyGetRecipesByAreaQueryMock.mockResolvedValue({
      data: mockAreaRecipes,
    });
    useLazyGetRecipesByCategoryQueryMock.mockResolvedValue({
      data: mockCategoryRecipes,
    });

    useLazyLookupRecipeQueryMock.mockResolvedValue({
      data: mockRecipeDetails,
    });
  });

  it("fetches and displays a recommendation on mount", async () => {
    render(
      <RecommendationCard preferences={mockPreferences} onReset={() => {}} />,
    );

    // Should show loading first?
    // We might not catch it if it's too fast, but we expect result eventually.

    await waitFor(() => {
      expect(screen.getByText("Pasta 1")).toBeInTheDocument();
    });

    expect(useLazyGetRecipesByAreaQueryMock).toHaveBeenCalledWith("Italian");
    expect(useLazyGetRecipesByCategoryQueryMock).toHaveBeenCalledWith("Pasta");
    expect(useLazyLookupRecipeQueryMock).toHaveBeenCalledWith("1");
  });

  it("fetches new recommendation on feedback (Yes)", async () => {
    render(
      <RecommendationCard preferences={mockPreferences} onReset={() => {}} />,
    );
    await waitFor(() => screen.getByText("Pasta 1"));

    const yesBtn = screen.getByText(/Yes, I like it/i);
    fireEvent.click(yesBtn);

    // Should trigger new fetch
    await waitFor(() => {
      expect(useLazyGetRecipesByAreaQueryMock).toHaveBeenCalledTimes(2);
    });
  });

  it("saves to history on feedback", async () => {
    render(
      <RecommendationCard preferences={mockPreferences} onReset={() => {}} />,
    );
    await waitFor(() => screen.getByText("Pasta 1"));

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    fireEvent.click(screen.getByText(/Yes, I like it/i));

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalled();
    });
  });

  it("handles no intersection found", async () => {
    // No intersection
    useLazyGetRecipesByCategoryQueryMock.mockResolvedValue({
      data: [{ idMeal: "999" }],
    });
    const onReset = vi.fn();

    render(
      <RecommendationCard preferences={mockPreferences} onReset={onReset} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/No Matches Found/i)).toBeInTheDocument();
    });

    const resetBtn = screen.getByText(/Adjust Preferences/i);
    fireEvent.click(resetBtn);

    expect(onReset).toHaveBeenCalled();
  });

  it("calls onReset when Modify Selection is clicked", async () => {
    const onReset = vi.fn();
    render(
      <RecommendationCard preferences={mockPreferences} onReset={onReset} />,
    );
    await waitFor(() => screen.getByText("Pasta 1"));

    const modifyBtn = screen.getByText(/Modify Selection/i);
    fireEvent.click(modifyBtn);

    expect(onReset).toHaveBeenCalled();
  });
});
