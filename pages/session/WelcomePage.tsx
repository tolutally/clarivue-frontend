import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { ArrowRight, CheckCircle, Clock, FileText } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const { sessionData } = useSession();

  const handleGetStarted = () => {
    navigate('/session/consent');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <InterviewHeader currentStep={1} totalSteps={6} stepLabel="Welcome" />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Welcome{sessionData?.user_name ? `, ${sessionData.user_name}` : ''}! 👋
              </h1>
              {sessionData?.cohort_name && (
                <p className="text-lg text-slate-600 mb-2">
                  Cohort: <span className="font-semibold">{sessionData.cohort_name}</span>
                </p>
              )}
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                You're about to start your AI-powered mock interview journey. Let's get you prepared to ace your next interview!
              </p>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Review and consent to data usage policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Provide a job description you're targeting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Test your camera and microphone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Start your personalized mock interview</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-slate-600 shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Time Commitment
                    </h4>
                    <p className="text-sm text-slate-600">
                      Setup takes 5-7 minutes. The mock interview itself is {sessionData?.time_limit_minutes || 30} minutes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-slate-600 shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      What You'll Need
                    </h4>
                    <p className="text-sm text-slate-600">
                      A job description, quiet space, working mic/camera, and stable internet.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                endIcon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

