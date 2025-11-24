import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { useSession } from '@/contexts/SessionContext';

export function SetupPage() {
  const navigate = useNavigate();
  const { sessionData, setSessionData } = useSession();
  
  const [roleTitle, setRoleTitle] = useState(sessionData?.role_title || '');
  const [jobDescription, setJobDescription] = useState(sessionData?.job_description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!roleTitle.trim()) {
      setError('Please enter a role title');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Store setup data in session context
      if (sessionData) {
        setSessionData({
          ...sessionData,
          role_title: roleTitle.trim(),
          job_description: jobDescription.trim(),
        });
      }
      
      navigate('/session/preflight');
    } catch (err) {
      console.error('Failed to setup session:', err);
      setError('Failed to save your information. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <InterviewHeader currentStep={3} totalSteps={6} stepLabel="Interview Setup" />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Set up your mock interview
            </h1>
            <p className="text-slate-600">
              Paste the role and job description you're preparing for. This helps us tailor the interview to match real scenarios.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-8">
              {/* Role Title */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {roleTitle.length}/100 characters
                </p>
              </div>

              {/* Job Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here. Include responsibilities, requirements, and any specific skills mentioned..."
                  rows={12}
                  maxLength={5000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {jobDescription.length}/5000 characters
                </p>
              </div>
            </Card>

            {/* Help text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                💡 Tips for Better Results
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The more detailed the job description, the better we can simulate a realistic interview</li>
                <li>• Include technical skills, soft skills, and specific responsibilities</li>
                {/* Removed resume upload tip */}
              </ul>
            </div>

            {/* Submit button */}
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => navigate('/session/consent')}
                variant="outline"
                startIcon={<ArrowLeft className="w-5 h-5" aria-hidden="true" />}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || !roleTitle.trim() || !jobDescription.trim()}
                loading={loading}
                variant="primary"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
