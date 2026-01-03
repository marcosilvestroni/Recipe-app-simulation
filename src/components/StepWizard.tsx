import React from 'react';
import { WizardContainer, ProgressBar, ProgressStep } from '../styles/components/StepWizard.styles';


interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export const StepWizard: React.FC<StepWizardProps> = ({ currentStep, totalSteps, children }) => {
  return (
    <WizardContainer>
      <ProgressBar>
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <ProgressStep key={idx} $active={idx + 1 <= currentStep} />
        ))}
      </ProgressBar>
      <div>
        {children}
      </div>
    </WizardContainer>
  );
};
