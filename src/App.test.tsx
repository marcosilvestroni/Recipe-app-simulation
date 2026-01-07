import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecipeApp } from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./store/formSlice";
import { describe, it, expect, vi } from "vitest";

// Mock child components to isolate App logic
vi.mock("./components/StepWizard", () => ({
  StepWizard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="step-wizard">{children}</div>
  ),
}));

vi.mock("./components/PreferenceForm", () => ({
  PreferenceForm: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="preference-form">
      <button onClick={onNext}>Next Step</button>
    </div>
  ),
}));

vi.mock("./components/RecommendationCard", () => ({
  RecommendationCard: ({ onReset }: { onReset: () => void }) => (
    <div data-testid="recommendation-card">
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

vi.mock("./components/HistoryList", () => ({
  HistoryList: () => <div data-testid="history-list">History</div>,
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      form: formReducer,
    },
  });

describe("RecipeApp", () => {
  it("renders initial state correctly (Step 1)", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <RecipeApp />
      </Provider>
    );

    expect(screen.getByText("RecipeMatcher")).toBeInTheDocument();
    expect(screen.getByTestId("step-wizard")).toBeInTheDocument();
    expect(screen.getByTestId("preference-form")).toBeInTheDocument();
    expect(screen.getByTestId("history-list")).toBeInTheDocument();
    expect(screen.queryByTestId("recommendation-card")).not.toBeInTheDocument();
  });

  it("navigates through steps 1 -> 2 -> 3", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <RecipeApp />
      </Provider>
    );

    // Step 1 -> 2
    const nextBtn = screen.getByText("Next Step");
    fireEvent.click(nextBtn);

    // Wait? Dispatch is sync.
    expect(store.getState().form.step).toBe(2);

    // Render should still show form (Step 2 uses same component/wizard)
    expect(screen.getByTestId("step-wizard")).toBeInTheDocument();

    // Step 2 -> 3
    fireEvent.click(nextBtn); // PreferenceForm mock sends onNext

    expect(store.getState().form.step).toBe(3);

    // Now RecommendationCard should appear, Form/Wizard disappear
    expect(screen.getByTestId("recommendation-card")).toBeInTheDocument();
    expect(screen.queryByTestId("step-wizard")).not.toBeInTheDocument();
  });

  it("navigates back to Step 1 on reset", () => {
    const store = createTestStore();
    // Manually set step to 3 to start? Or navigate.
    // Let's navigate to be safe.
    render(
      <Provider store={store}>
        <RecipeApp />
      </Provider>
    );

    // Navigate to 3
    fireEvent.click(screen.getByText("Next Step")); // 1->2
    fireEvent.click(screen.getByText("Next Step")); // 2->3

    expect(screen.getByTestId("recommendation-card")).toBeInTheDocument();

    // Click Reset
    fireEvent.click(screen.getByText("Reset"));

    expect(store.getState().form.step).toBe(1);
    expect(screen.getByTestId("preference-form")).toBeInTheDocument();
    expect(screen.queryByTestId("recommendation-card")).not.toBeInTheDocument();
  });
});
