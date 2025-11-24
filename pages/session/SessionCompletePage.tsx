import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Home, RotateCcw, Clock, MessageSquare } from 'lucide-react';
import { aiSessionsService } from '@/services/aiSessions/aiSessions.service';

export function SessionCompletePage() {
  const navigate = useNavigate();
  const { sessionData, clearSession } = useSession();
  const [isClosing, setIsClosing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [sessionStatus, setSessionStatus] = useState<any>(null);

  useEffect(() => {
    // Get session ID from localStorage or session data
    // The session ID should be stored when the session starts
    const storedSessionId = localStorage.getItem('ai_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      closeSession(storedSessionId);
    } else {
      setError('Session ID not found');
      setIsClosing(false);
    }
  }, []);

  const closeSession = async (sessionIdToClose: string) => {
    try {
      setIsClosing(true);
      setError(null);

      // 1. Get session status BEFORE closing (to see elapsed time, remaining time, etc.)
      try {
        const statusData = await aiSessionsService.getSessionStatus(sessionIdToClose);
        setSessionStatus(statusData);
        console.log('Session status before close:', statusData);
      } catch (err) {
        console.error('Failed to fetch session status:', err);
        // Don't fail the whole flow if status fetch fails
      }

      // 2. Close session FIRST (transcript is only available after session is closed)
      await aiSessionsService.closeSession(sessionIdToClose);
      console.log('Session closed successfully');

      // 3. Wait a moment for backend to finalize transcript
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. Fetch transcript AFTER closing the session
      try {
        const transcriptData = await aiSessionsService.getTranscript(sessionIdToClose);
        setTranscript(transcriptData.transcript || []);
        console.log('Transcript fetched:', transcriptData.transcript?.length || 0, 'messages');
      } catch (err) {
        console.error('Failed to fetch transcript:', err);
        // Don't fail the whole flow if transcript fetch fails
        setError('Session closed successfully, but transcript could not be retrieved.');
      }

      setIsClosing(false);
    } catch (err: any) {
      console.error('Failed to close session:', err);
      const errorMsg = err?.message || 'Failed to close session';
      setError(errorMsg);
      setIsClosing(false);
    }
  };

  const handleStartNewSession = () => {
    const originalToken = sessionData?.original_token;
    if (originalToken) {
      // Navigate back to join page with token
      window.location.href = `/session/join?token=${originalToken}`;
    } else {
      setError('Unable to start new session. Missing token.');
    }
  };

  const handleGoHome = () => {
    clearSession();
    window.location.href = '/login';
  };

  const sessionsRemaining = sessionData?.sessions_remaining ?? 0;
  const hasMoreSessions = sessionsRemaining > 0;

  if (isClosing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Closing Session</h2>
          <p className="text-slate-600">Please wait while we finalize your interview session...</p>
        </Card>
      </div>
    );
  }

  if (error && !sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={handleGoHome} variant="primary" className="w-full">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="pt-12 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Interview Session Complete
            </h1>
            <p className="text-slate-600">
              Your interview has been saved and will be analyzed.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> {error}
              </p>
            </div>
          )}

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Sessions Remaining</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{sessionsRemaining}</span>
              </div>

              {sessionStatus && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Session Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {sessionStatus.session_type && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Session Type:</span>
                        <span className="font-medium text-slate-900 capitalize">
                          {sessionStatus.session_type.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    {sessionStatus.status && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className="font-medium text-slate-900 capitalize">{sessionStatus.status}</span>
                      </div>
                    )}
                    {sessionStatus.duration_seconds && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium text-slate-900">
                          {Math.floor(sessionStatus.duration_seconds / 60)} minutes
                        </span>
                      </div>
                    )}
                    {sessionStatus.started_at && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Started At:</span>
                        <span className="font-medium text-slate-900">
                          {new Date(sessionStatus.started_at).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {transcript.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Transcript</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-2 text-sm">
                      {transcript.slice(-5).map((msg, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="font-semibold text-slate-700 min-w-[60px]">
                            {msg.role === 'user' ? 'You:' : 'AI:'}
                          </span>
                          <span className="text-slate-600 flex-1">{msg.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            {hasMoreSessions ? (
              <>
                <Button
                  onClick={handleStartNewSession}
                  variant="primary"
                  className="flex-1"
                  startIcon={<RotateCcw className="w-5 h-5" />}
                >
                  Start New Session
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1"
                  startIcon={<Home className="w-5 h-5" />}
                >
                  Go Home
                </Button>
              </>
            ) : (
              <Button
                onClick={handleGoHome}
                variant="primary"
                className="w-full"
                startIcon={<Home className="w-5 h-5" />}
              >
                Go Home
              </Button>
            )}
          </div>

          {hasMoreSessions && (
            <p className="text-center text-sm text-slate-500 mt-4">
              You have {sessionsRemaining} session{sessionsRemaining !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

