import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, Shield, Video, Users, Database, AlertCircle } from 'lucide-react';
import backend from '~backend/client';

export function ConsentPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [consents, setConsents] = useState({
    recordingConsent: false,
    dataUsageConsent: false,
    researchConsent: false
  });

  const [showError, setShowError] = useState(false);

  const allRequiredConsentsGiven = consents.recordingConsent && consents.dataUsageConsent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequiredConsentsGiven) {
      setShowError(true);
      return;
    }

    if (!token) {
      setError('Invalid token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await backend.mockinterviews.submitConsent({
        token,
        consents: {
          recordingConsent: consents.recordingConsent,
          dataUsageConsent: consents.dataUsageConsent,
          researchConsent: consents.researchConsent
        }
      });

      if (response.success) {
        navigate(`/mockinterviews/jd-intake/${token}`);
      } else {
        setError(response.message || 'Failed to save consent');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Privacy & Data Consent
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Your privacy matters. Please review and agree to how we'll handle your interview data.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            {showError && !allRequiredConsentsGiven && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Required consents missing.</strong> You must agree to recording and data usage to proceed with the interview.
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      What is Recorded
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Video and audio of your interview responses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Screen activity during technical coding portions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Response transcripts and AI-generated analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Performance metrics and skill assessments</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Who Sees Your Data
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Your assigned career advisor</strong> - Full access to interviews and feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Clarivue AI system</strong> - Automated analysis and feedback generation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Institutional administrators</strong> - Anonymized metrics and cohort statistics only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Your data will <strong>never</strong> be shared with employers without your explicit permission</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Data Retention
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Interview recordings:</strong> Stored for 90 days, then automatically deleted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Analysis and feedback:</strong> Retained for program duration + 1 year</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span><strong>Anonymized metrics:</strong> May be retained indefinitely for research purposes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>You may request deletion of your data at any time by contacting support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="recordingConsent"
                    checked={consents.recordingConsent}
                    onChange={(e) => {
                      setConsents({ ...consents, recordingConsent: e.target.checked });
                      if (showError) setShowError(false);
                    }}
                    aria-required="true"
                    aria-describedby="recordingConsent-description"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="recordingConsent" 
                      className="font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      I consent to the recording of my interview
                      <span className="text-red-500 ml-1" aria-label="required">*</span>
                    </Label>
                    <p id="recordingConsent-description" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      This includes video, audio, and screen recordings during the interview session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="dataUsageConsent"
                    checked={consents.dataUsageConsent}
                    onChange={(e) => {
                      setConsents({ ...consents, dataUsageConsent: e.target.checked });
                      if (showError) setShowError(false);
                    }}
                    aria-required="true"
                    aria-describedby="dataUsageConsent-description"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="dataUsageConsent" 
                      className="font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      I consent to the usage of my data as described above
                      <span className="text-red-500 ml-1" aria-label="required">*</span>
                    </Label>
                    <p id="dataUsageConsent-description" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Your data will be used for AI analysis, advisor feedback, and institutional reporting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="researchConsent"
                    checked={consents.researchConsent}
                    onChange={(e) => setConsents({ ...consents, researchConsent: e.target.checked })}
                    aria-describedby="researchConsent-description"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="researchConsent" 
                      className="font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      I consent to anonymized data being used for research (Optional)
                    </Label>
                    <p id="researchConsent-description" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Help improve interview preparation for future students. All data is fully anonymized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/mockinterviews/profile/${token}`)}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !allRequiredConsentsGiven} 
                className="gap-2"
              >
                {loading ? 'Saving...' : 'I Agree & Continue'}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
