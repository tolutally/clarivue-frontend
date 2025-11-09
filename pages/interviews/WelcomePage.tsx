import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { InterviewHeader } from '../../components/interview/InterviewHeader';

/**
 * WelcomePage
 * 
 * Route: /session/:sessionId/welcome
 * 
 * Purpose: Welcome screen with interview overview and expectations.
 * Adapted from legacy mockinterviews/WelcomePage with new session-based routing.
 */
export function WelcomePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    // Session is already validated, just load the page
    setLoading(false);
  }, [sessionId]);

  const handleGetStarted = () => {
    navigate(`/session/${sessionId}/profile`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <InterviewHeader currentStep={1} totalSteps={7} stepLabel="Welcome" />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Welcome! 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              You're about to start your AI-powered mock interview journey. Let's get you prepared to ace your next interview!
            </p>
          </div>

          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  What to Expect
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Complete your profile with career preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Review and consent to data usage policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Provide a job description you're targeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Test your camera and microphone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Start your personalized mock interview</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400 shrink-0" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Time Commitment
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Setup takes 5-7 minutes. The mock interview itself is 30-45 minutes.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400 shrink-0" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    What You'll Need
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    A job description, quiet space, working mic/camera, and stable internet.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
