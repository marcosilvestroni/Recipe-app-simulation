import { render, screen, fireEvent } from "@testing-library/react";
import { PreferenceForm } from "./index";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the API hooks
const useGetAreasQueryMock = vi.fn();
const useGetCategoriesQueryMock = vi.fn();
const useGetIngredientsQueryMock = vi.fn();

vi.mock("../../api/recipeApi", () => ({
  useGetAreasQuery: () => useGetAreasQueryMock(),
  useGetCategoriesQuery: () => useGetCategoriesQueryMock(),
  useGetIngredientsQuery: () => useGetIngredientsQueryMock(),
}));

describe("PreferenceForm", () => {
  const mockProps = {
    step: 1,
    preferences: {
      area: "",
      categoryOrIngredient: "",
      strategy: "category" as const,
    },
    onUpdate: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useGetAreasQueryMock.mockReturnValue({
      data: [{ strArea: "Italian" }, { strArea: "French" }],
    });
    useGetCategoriesQueryMock.mockReturnValue({
      data: [{ strCategory: "Beef" }, { strCategory: "Vegan" }],
    });
    useGetIngredientsQueryMock.mockReturnValue({
      data: [{ strIngredient: "Chicken" }, { strIngredient: "Garlic" }],
    });
  });

  it("renders step 1 with areas", () => {
    render(<PreferenceForm {...mockProps} />);
    expect(
      screen.getByText("Where would you like to eat?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select a cuisine style or region."),
    ).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("handles area selection in step 1", () => {
    render(<PreferenceForm {...mockProps} />);
    fireEvent.click(screen.getByText("Italian"));
    expect(mockProps.onUpdate).toHaveBeenCalledWith({ area: "Italian" });
  });

  it("disables next button in step 1 if no area selected", () => {
    render(<PreferenceForm {...mockProps} />);
    const nextButton = screen.getByText("Next Step");
    expect(nextButton).toBeDisabled();
  });

  it("enables next button and calls onNext in step 1 when area selected", () => {
    const propsWithArea = {
      ...mockProps,
      preferences: { ...mockProps.preferences, area: "Italian" },
    };
    render(<PreferenceForm {...propsWithArea} />);
    const nextButton = screen.getByText("Next Step");
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    expect(mockProps.onNext).toHaveBeenCalled();
  });

  it("renders step 2 with categories by default", () => {
    render(<PreferenceForm {...mockProps} step={2} />);
    expect(
      screen.getByText("What are you in the mood for?"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeChecked();
    expect(screen.getByText("Beef")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
  });

  it("handles category selection in step 2", () => {
    render(<PreferenceForm {...mockProps} step={2} />);
    fireEvent.click(screen.getByText("Beef"));
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      categoryOrIngredient: "Beef",
    });
  });

  it("switches to ingredient strategy", () => {
    render(<PreferenceForm {...mockProps} step={2} />);
    fireEvent.click(screen.getByLabelText("Main Ingredient"));
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      strategy: "ingredient",
      categoryOrIngredient: "",
    });
  });

  it("renders ingredient search when strategy is ingredient", () => {
    const propsIngredient = {
      ...mockProps,
      step: 2,
      preferences: {
        ...mockProps.preferences,
        strategy: "ingredient" as const,
      },
    };
    render(<PreferenceForm {...propsIngredient} />);
    expect(
      screen.getByPlaceholderText("Type to search..."),
    ).toBeInTheDocument();
  });

  it("filters and selects ingredients", () => {
    const propsIngredient = {
      ...mockProps,
      step: 2,
      preferences: {
        ...mockProps.preferences,
        strategy: "ingredient" as const,
      },
    };
    render(<PreferenceForm {...propsIngredient} />);

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "Chi" } });

    expect(screen.getByText("Chicken")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Chicken"));
    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      categoryOrIngredient: "Chicken",
    });
  });

  it("updates local input state when props change to a new value", () => {
    const propsIngredient = {
      ...mockProps,
      step: 2,
      preferences: {
        ...mockProps.preferences,
        strategy: "ingredient" as const,
        categoryOrIngredient: "Garlic",
      },
    };
    const { rerender } = render(<PreferenceForm {...propsIngredient} />);
    const input = screen.getByPlaceholderText(
      "Type to search...",
    ) as HTMLInputElement;
    expect(input.value).toBe("Garlic");

    // Update prop
    rerender(
      <PreferenceForm
        {...{
          ...propsIngredient,
          preferences: {
            ...propsIngredient.preferences,
            categoryOrIngredient: "Chicken",
          },
        }}
      />,
    );
    expect(input.value).toBe("Chicken");
  });

  it("calls onBack and onNext in step 2", () => {
    const propsReady = {
      ...mockProps,
      step: 2,
      preferences: { ...mockProps.preferences, categoryOrIngredient: "Beef" },
    };
    render(<PreferenceForm {...propsReady} />);

    fireEvent.click(screen.getByText("Back"));
    expect(mockProps.onBack).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Find Recipe"));
    expect(mockProps.onNext).toHaveBeenCalled();
  });

  it("disables find recipe button if no selection in step 2", () => {
    render(<PreferenceForm {...mockProps} step={2} />);
    expect(screen.getByText("Find Recipe")).toBeDisabled();
  });
});
