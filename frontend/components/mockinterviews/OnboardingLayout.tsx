import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  showLogo?: boolean;
}

export function OnboardingLayout({ 
  children, 
  currentStep, 
  totalSteps,
  showLogo = true 
}: OnboardingLayoutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {showLogo && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/clarivue-logo.png" 
                alt="Clarivue" 
                className="h-8 w-auto"
              />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </header>
      )}

      <div className="fixed top-[73px] left-0 right-0 z-40 h-1 bg-slate-200 dark:bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        />
      </div>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  );
}
