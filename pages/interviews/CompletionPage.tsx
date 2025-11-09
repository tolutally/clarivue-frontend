import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/interview/PageHeader';
import { InterviewHeader } from '../../components/interview/InterviewHeader';
import { LoadingState } from '../../components/interview/LoadingState';
import { CheckCircle2, Loader2, FileText, X } from 'lucide-react';

/**
 * CompletionPage
 * 
 * Route: /session/:sessionId/complete
 * 
 * Purpose: Show completion status and poll for interview report.
 * 
 * States:
 * - processing: Report not ready yet (show spinner + message)
 * - ready: Report available (show summary or preview)
 * 
 * Polls GET /api/session/:sessionId/report every 5-10s until ready.
 */
export function CompletionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  
  const [status, setStatus] = useState<'processing' | 'ready'>('processing');
  const [error, setError] = useState<string | null>(null);
  const [showCloseInstructions, setShowCloseInstructions] = useState(false);

  const handleCloseTab = () => {
    try {
      window.close();
      // If the tab doesn't close immediately, show instructions
      setTimeout(() => {
        setShowCloseInstructions(true);
      }, 500);
    } catch (error) {
      setShowCloseInstructions(true);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Mark interview as complete
    const completeInterview = async () => {
      try {
        await backend.interviews.completeInterview(sessionId);
        setStatus('ready');
      } catch (err) {
        console.error('Failed to complete interview:', err);
        setError('Failed to submit interview. Please try again.');
      }
    };

    completeInterview();
  }, [sessionId, backend, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleCloseTab}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
          >
            Close Tab
          </button>
          {showCloseInstructions && (
            <p className="mt-4 text-sm text-gray-600">
              Please close this tab manually using <kbd className="bg-gray-100 px-1 rounded">Ctrl+W</kbd> (Windows/Linux) or <kbd className="bg-gray-100 px-1 rounded">Cmd+W</kbd> (Mac)
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <InterviewHeader currentStep={7} totalSteps={7} stepLabel="Complete" />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
        {/* Completion Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h1>
          <p className="text-gray-600">
            Thank you for participating. Your interview has been submitted.
          </p>
        </div>

        {/* Report Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {status === 'processing' ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              
              <PageHeader
                title="Submitting Your Interview"
                subtitle="Please wait while we process your interview responses..."
              />
            </>
          ) : (
            <>
              <PageHeader
                title="Interview Submitted Successfully!"
                subtitle="Your interview has been completed and submitted for review."
              />

              {/* Success Message */}
              <div className="mt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Your interview recording has been saved and will be analyzed by our AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>A detailed performance report will be generated with personalized feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You will receive an email notification when your report is ready</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Your advisor will also have access to review your performance</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Report generation typically takes 5-10 minutes. You'll receive an email at your registered address once it's ready.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleCloseTab}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
                >
                  <X className="w-5 h-5" />
                  Close Tab
                </button>
              </div>
              
              {showCloseInstructions && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Unable to close tab automatically.</strong><br />
                    Please close this tab manually using <kbd className="bg-white px-2 py-1 rounded border">Ctrl+W</kbd> (Windows/Linux) or <kbd className="bg-white px-2 py-1 rounded border">Cmd+W</kbd> (Mac)
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Session ID: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{sessionId}</code>
          </p>
        </div>
        </div>
      </main>
    </div>
  );
}
