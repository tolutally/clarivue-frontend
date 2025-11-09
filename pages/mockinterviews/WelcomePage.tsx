import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import backend from '@/lib/api-client';
import type { StudentInfo } from '@/lib/backend-types';

export function WelcomePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentInfo | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid invite link');
      setLoading(false);
      return;
    }

    backend.mockinterviews.verifyToken({ token })
      .then(response => {
        if (!response.valid) {
          setError(response.message || 'Invalid invite link');
        } else if (response.currentStep === 'completed') {
          navigate('/');
        } else {
          setStudent(response.student || null);
          if (response.currentStep !== 'welcome') {
            navigate(`/mockinterviews/${response.currentStep}/${token}`);
          }
        }
      })
      .catch(() => {
        setError('Failed to verify invite link. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleGetStarted = () => {
    navigate(`/mockinterviews/profile/${token}`);
  };

  if (loading) {
    return (
      <OnboardingLayout currentStep={1} totalSteps={6}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Verifying your invite...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  if (error) {
    return (
      <OnboardingLayout currentStep={1} totalSteps={6}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Go to Home
          </Button>
        </Card>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={1} totalSteps={6}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome, {student?.name}! 👋
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

        {student && (
          <Card className="p-5 bg-slate-50 dark:bg-slate-900">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Your Details
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Email:</span>
                <span className="ml-2 text-slate-900 dark:text-slate-100">{student.email}</span>
              </div>
              {student.institution && (
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Institution:</span>
                  <span className="ml-2 text-slate-900 dark:text-slate-100">{student.institution}</span>
                </div>
              )}
              {student.cohortName && (
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Cohort:</span>
                  <span className="ml-2 text-slate-900 dark:text-slate-100">{student.cohortName}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="gap-2 px-8"
          >
            Get Started
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
