interface InterviewHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

/**
 * InterviewHeader Component
 * 
 * Consistent header with logo and progress bar for interview onboarding flow.
 * Uses app's general styling and color scheme.
 */
export function InterviewHeader({ currentStep, totalSteps, stepLabel }: InterviewHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/clarivue-logo.png" 
              alt="Clarivue" 
              className="h-8 w-auto"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400">
            {stepLabel ? (
              <>
                <span className="font-medium text-[var(--primary)]">Step {currentStep} of {totalSteps}</span>
                <span className="mx-2">•</span>
                <span>{stepLabel}</span>
              </>
            ) : (
              <span className="font-medium text-[var(--primary)]">Step {currentStep} of {totalSteps}</span>
            )}
          </div>
        </div>
      </header>

      <div className="fixed top-[73px] left-0 right-0 z-40 h-1 bg-gray-200 dark:bg-slate-800">
        <div 
          className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        />
      </div>
    </>
  );
}
