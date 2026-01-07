import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { setStep, updatePreferences } from "./store/formSlice";

import { GlobalStyle } from "./styles/GlobalStyle";
import { Container } from "./styles/shared";
import { StepWizard } from "./components/StepWizard";
import { PreferenceForm } from "./components/PreferenceForm";
import { RecommendationCard } from "./components/RecommendationCard";
import { HistoryList } from "./components/HistoryList";
import { useAppDispatch, useAppSelector } from "./store/hooks";

export const RecipeApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { step, preferences } = useAppSelector((state) => state.form);

  return (
    <Container>
      <GlobalStyle />
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            color: "var(--color-primary)",
            fontSize: "2.5rem",
            margin: 0,
          }}
        >
          RecipeMatcher
        </h1>
        <p style={{ color: "var(--color-text-light)" }}>
          Find your next favorite meal in seconds.
        </p>
      </header>

      {step < 3 && (
        <StepWizard currentStep={step} totalSteps={2}>
          <PreferenceForm
            step={step}
            preferences={preferences}
            onUpdate={(updates) => dispatch(updatePreferences(updates))}
            onNext={() => {
              if (step === 1) dispatch(setStep(2));
              else dispatch(setStep(3));
            }}
            onBack={() => dispatch(setStep(step - 1))}
          />
        </StepWizard>
      )}

      {step === 3 && (
        <RecommendationCard
          preferences={preferences}
          onReset={() => dispatch(setStep(1))}
        />
      )}

      <HistoryList />
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
