import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { LoadingState } from '../../components/interview/LoadingState';
import { AlertCircle } from 'lucide-react';

/**
 * InviteLandingPage
 * 
 * Route: /invite/:token
 * 
 * Purpose: Validate the magic link token and redirect to welcome page.
 * 
 * Flow:
 * 1. Extract token from URL
 * 2. Call GET /api/invite/:token
 * 3. If valid → redirect to /session/:sessionId/welcome (start of unified flow)
 * 4. If invalid → show error message
 */
export function InviteLandingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No invite token provided');
      setLoading(false);
      return;
    }

    const validateInvite = async () => {
      try {
        setLoading(true);
        const response = await backend.interviews.validateInvite(token);
        
        if (response.valid && response.sessionId) {
          // Valid invite - redirect to welcome (start of unified flow)
          navigate(`/session/${response.sessionId}/welcome`, { replace: true });
        } else {
          // Invalid invite
          setError(response.message || 'This invite link is invalid or has expired.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to validate invite:', err);
        setError('Failed to validate invite link. Please try again.');
        setLoading(false);
      }
    };

    validateInvite();
  }, [token, backend, navigate]);

  if (loading) {
    return <LoadingState message="Checking your invite..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-hover)] px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invite
          </h1>
          
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <p className="text-sm text-gray-500">
            Please contact your programme administrator for a new invite link.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
