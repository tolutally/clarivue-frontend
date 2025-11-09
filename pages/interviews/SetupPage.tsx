import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/interview/PageHeader';
import { InterviewHeader } from '../../components/interview/InterviewHeader';
import { Briefcase, FileText, Upload, X, FileCheck, ArrowLeft } from 'lucide-react';

/**
 * SetupPage
 * 
 * Route: /session/:sessionId/setup
 * 
 * Purpose: Collect role title and job description from the student.
 * 
 * Flow:
 * 1. Student enters role title and job description
 * 2. Form validation (both required)
 * 3. POST to /api/session/:sessionId/setup
 * 4. On success → navigate to /session/:sessionId/preflight
 */
export function SetupPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  
  const [roleTitle, setRoleTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setError(null);
  };

  const removeResume = () => {
    setResumeFile(null);
  };

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

    if (!sessionId) {
      setError('Invalid session');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll store resume as base64 in the session data
      // In production, this should be uploaded to a file storage service
      let resumeData = null;
      if (resumeFile) {
        const reader = new FileReader();
        resumeData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      }
      
      await backend.interviews.setupSession(sessionId, {
        roleTitle: roleTitle.trim(),
        jobDescription: jobDescription.trim(),
        resume: resumeData ? {
          fileName: resumeFile!.name,
          fileType: resumeFile!.type,
          fileSize: resumeFile!.size,
          data: resumeData,
        } : undefined,
      });
      
      // Success - navigate to preflight
      navigate(`/session/${sessionId}/preflight`);
    } catch (err) {
      console.error('Failed to setup session:', err);
      setError('Failed to save your information. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <InterviewHeader currentStep={4} totalSteps={7} stepLabel="Interview Setup" />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">

        <PageHeader
          title="Set up your mock interview"
          subtitle="Paste the role and job description you're preparing for. This helps us tailor the interview to match real scenarios."
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {jobDescription.length}/5000 characters
              </p>
            </div>

            {/* Resume Upload (Optional) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 text-gray-500" />
                Upload Resume <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Upload your resume to help our AI ask personalized questions based on your experience.
              </p>

              {!resumeFile ? (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--primary)] hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload PDF or Word document (Max 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                      <p className="text-xs text-gray-600">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="Remove resume"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Help text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Tips for Better Results
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The more detailed the job description, the better we can simulate a realistic interview</li>
              <li>• Include technical skills, soft skills, and specific responsibilities</li>
              <li>• Uploading your resume helps us ask questions relevant to your experience level</li>
            </ul>
          </div>

          {/* Submit button */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(`/session/${sessionId}/consent`)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !roleTitle.trim() || !jobDescription.trim()}
              className="bg-[var(--primary)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
        </div>
      </main>
    </div>
  );
}
