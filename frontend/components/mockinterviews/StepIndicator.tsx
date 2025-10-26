import { Check } from 'lucide-react';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between gap-2 md:gap-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div 
                    className={`h-0.5 flex-1 transition-colors ${
                      step.status === 'completed' 
                        ? 'bg-blue-500' 
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                )}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    step.status === 'completed'
                      ? 'bg-blue-500 text-white'
                      : step.status === 'current'
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                  aria-current={step.status === 'current' ? 'step' : undefined}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`h-0.5 flex-1 transition-colors ${
                      steps[index + 1].status === 'completed' 
                        ? 'bg-blue-500' 
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
              <span 
                className={`text-xs text-center hidden md:block transition-colors ${
                  step.status === 'current'
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : step.status === 'completed'
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
