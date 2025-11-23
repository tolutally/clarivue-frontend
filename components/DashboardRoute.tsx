import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorBoundary } from './ErrorBoundary';

export function DashboardRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, admin } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct user_type to access dashboard
  const userType = admin?.user?.role?.user_type;
  if (userType !== 'user') {
    return <Navigate to="/coming-soon" replace />;
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

