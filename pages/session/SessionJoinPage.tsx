import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifySessionToken } from '@/hooks/useSessionInvites';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

export function SessionJoinPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const verifyMutation = useVerifySessionToken();
  const { setSessionData } = useSession();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple verification attempts
    if (hasVerifiedRef.current || verifyMutation.isPending) {
      return;
    }

    if (!token) {
      setError('No token provided in the link. Please check your email and try again.');
      return;
    }

    hasVerifiedRef.current = true;

    const verifyToken = async () => {
      try {
        setError(null);
        const response = await verifyMutation.mutateAsync({ token });

        // Store session data in context
        setSessionData({
          session_access_token: response.access_token,
          user_id: response.user_id,
          user_name: response.user_name,
          user_email: response.user_email,
          sessions_remaining: response.sessions_remaining,
          time_limit_minutes: response.time_limit_minutes,
          session_type: response.session_type,
          cohort_name: response.cohort_name,
          original_token: token, // Store the original token for potential reuse
        });

        // Navigate to welcome page
        navigate('/session/welcome', { replace: true });
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to verify session token';
        setError(errorMsg);
        toast.error('Verification Failed', errorMsg);
        // Reset the ref on error so user can retry
        hasVerifiedRef.current = false;
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRetry = async () => {
    if (token) {
      setError(null);
      hasVerifiedRef.current = true;
      try {
        const response = await verifyMutation.mutateAsync({ token });
        
        // Store session data in context
        setSessionData({
          session_access_token: response.access_token,
          user_id: response.user_id,
          user_name: response.user_name,
          user_email: response.user_email,
          sessions_remaining: response.sessions_remaining,
          time_limit_minutes: response.time_limit_minutes,
          session_type: response.session_type,
          cohort_name: response.cohort_name,
          original_token: token, // Store the original token for potential reuse
        });

        // Navigate to welcome page
        navigate('/session/welcome', { replace: true });
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to verify session token';
        setError(errorMsg);
        toast.error('Verification Failed', errorMsg);
        hasVerifiedRef.current = false;
      }
    }
  };

  // Determine if we have an error (from React Query or local state)
  // Prioritize error state - if there's an error, show it even if isPending is briefly true
  const hasError = verifyMutation.isError || error || !token;
  
  // Get error message from React Query error or local error state
  const errorMessage = verifyMutation.error 
    ? (verifyMutation.error as any)?.response?.data?.error?.detail || 
      (verifyMutation.error as any)?.message || 
      'Failed to verify session token'
    : error || (!token ? 'No invite token provided in the link. Please check your email and try again.' : null);

  // Show error state first (prioritize error over loading)
  // If there's an error, show it immediately even if isPending might be true briefly
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Invalid Invite
          </h2>
          <p className="text-slate-600 mb-6">
            {errorMessage || 'No invite token provided in the link. Please check your email and try again.'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact your programme administrator for a new invite link.
          </p>
          {token && (
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} disabled={verifyMutation.isPending}>
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Show loading state only when actually pending and no error yet
  if (verifyMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Your Session</h2>
          <p className="text-slate-600">Please wait while we verify your interview invitation...</p>
        </Card>
      </div>
    );
  }

  return null;
}

