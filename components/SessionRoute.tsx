import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

export function SessionRoute({ children }: { children: React.ReactNode }) {
  const { isSessionActive } = useSession();
  const location = useLocation();

  if (!isSessionActive) {
    // Redirect to join page, preserving the intended destination in state
    return <Navigate to="/session/join" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

