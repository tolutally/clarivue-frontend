import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

export function SessionRoute({ children }: { children: React.ReactNode }) {
  const { isSessionActive, isSessionLoading } = useSession();
  const location = useLocation();

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Restoring your session...</p>
      </div>
    );
  }

  if (!isSessionActive) {
    // Redirect to join page, preserving the intended destination in state
    return <Navigate to="/session/join" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

