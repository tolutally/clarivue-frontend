import { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
  children?: ReactNode;
}

/**
 * LoadingState Component
 * 
 * Centered loading spinner with optional message
 */
export function LoadingState({ message = 'Loading...', children }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-hover)] px-6">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
        {children}
      </div>
    </div>
  );
}
