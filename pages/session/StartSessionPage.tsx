import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useStartSession } from '@/hooks/useSessionInvites';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { ArrowLeft, AlertTriangle, Clock, Users } from 'lucide-react';

export function StartSessionPage() {
  const navigate = useNavigate();
  const { sessionData, setSessionData } = useSession();
  const startSessionMutation = useStartSession();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleStartInterview = async () => {
    if (!sessionData?.session_access_token) {
      setError('Session token not found. Please start over.');
      return;
    }

    if (sessionData.sessions_remaining === 0) {
      setError('You have no sessions remaining. Please contact support.');
      return;
    }

    try {
      setError(null);
      const response = await startSessionMutation.mutateAsync();

      // Update session data with new token and updated session count
      // Ensure we preserve all existing fields, especially original_token
      setSessionData({
        ...sessionData,
        session_access_token: response.session_access_token,
        sessions_remaining: response.sessions_remaining,
        original_token: sessionData?.original_token || null, // Explicitly preserve original_token
      });

      // Navigate to interview room
      navigate('/session/interview', { replace: true });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to start session';
      setError(errorMsg);
      toast.error('Failed to Start Session', errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <InterviewHeader currentStep={5} totalSteps={6} stepLabel="Ready to Start" />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Ready to Start?
            </h1>
            <p className="text-slate-600">
              Review the information below before starting your interview.
            </p>
          </div>

          <Card className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Important Notice</h3>
                  <p className="text-sm text-amber-800">
                    Once you click "Start Interview", your session count will be decremented. 
                    Make sure you're ready to begin before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Sessions Remaining</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sessionData?.sessions_remaining ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Time Limit</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sessionData?.time_limit_minutes ?? 30} minutes
                  </p>
                </div>
              </div>

              {sessionData?.cohort_name && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-slate-600">Cohort</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {sessionData.cohort_name}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => navigate('/session/preflight')}
                variant="outline"
                startIcon={<ArrowLeft className="w-5 h-5" aria-hidden="true" />}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleStartInterview}
                disabled={startSessionMutation.isPending || (sessionData?.sessions_remaining ?? 0) === 0}
                loading={startSessionMutation.isPending}
                variant="primary"
                size="lg"
              >
                {startSessionMutation.isPending ? 'Starting...' : 'Start Interview'}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

