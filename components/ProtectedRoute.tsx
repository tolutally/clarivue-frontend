import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ErrorBoundary } from './ErrorBoundary';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, login } = useAuth();

  useEffect(() => {
    // Auto-login for development with mock backend
    if (!loading && !isAuthenticated) {
      login('dev@clarivue.com', 'password').catch((err) => {
        console.error('Auto-login failed:', err);
      });
    }
  }, [loading, isAuthenticated, login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
