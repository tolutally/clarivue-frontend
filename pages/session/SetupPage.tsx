import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Plus,
  Loader2,
  Building,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { useSession } from '@/contexts/SessionContext';
import {
  jobSubmissionsService,
  type JobSubmission,
} from '@/services/jobSubmissions/jobSubmissions.service';

export function SetupPage() {
  const navigate = useNavigate();
  const { sessionData, setSessionData } = useSession();
  
  const [jobs, setJobs] = useState<JobSubmission[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState(
    sessionData?.job_submission_id || ''
  );
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobFocusAreas, setNewJobFocusAreas] = useState('');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        const response = await jobSubmissionsService.getJobs();
        setJobs(response.jobs || []);
        setSelectedJobId(prev => prev || response.jobs?.[0]?.id || '');
      } catch (err: any) {
        console.error('Failed to fetch jobs:', err);
        setJobsError(err?.message || 'Unable to load jobs. Please try again.');
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const selectedJob = useMemo(
    () => jobs.find(job => job.id === selectedJobId),
    [jobs, selectedJobId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob) {
      setError('Please select a saved job to continue.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Store selected job data in session context
      if (sessionData) {
        setSessionData({
          ...sessionData,
          role_title: selectedJob.job_title,
          job_description: selectedJob.job_description,
          job_submission_id: selectedJob.id,
          job_company: selectedJob.company_name || null,
          job_focus_areas: selectedJob.focus_areas || null,
        });
      }

      navigate('/session/preflight');
    } catch (err: any) {
      console.error('Failed to setup session:', err);
      const errorMsg = err?.message || 'Failed to save your information. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newJobTitle.trim() || !newJobDescription.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setIsCreatingJob(true);
      setError(null);

      const focusAreas = newJobFocusAreas
        .split(',')
        .map(area => area.trim())
        .filter(Boolean);

      const newJob = await jobSubmissionsService.createJob({
        job_title: newJobTitle.trim(),
        job_description: newJobDescription.trim(),
        company_name: newJobCompany.trim() || undefined,
        focus_areas: focusAreas.length ? focusAreas : undefined,
      });

      setJobs(prev => [newJob, ...prev]);
      setSelectedJobId(newJob.id);
      setShowJobModal(false);
      setNewJobTitle('');
      setNewJobDescription('');
      setNewJobCompany('');
      setNewJobFocusAreas('');
    } catch (err: any) {
      console.error('Failed to create job:', err);
      setError(err?.message || 'Failed to create job. Please try again.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <InterviewHeader currentStep={3} totalSteps={6} stepLabel="Interview Setup" />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Start AI Session
            </h1>
            <p className="text-slate-600">
              Select a saved job description or create a new one to tailor your mock interview.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Select Job</p>
                    <h2 className="text-xl font-semibold text-slate-900">Choose a saved job</h2>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    startIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowJobModal(true)}
                  >
                    Create Job
                  </Button>
                </div>

                {jobsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : jobsError ? (
                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
                    {jobsError}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">
                    <p className="text-slate-600 mb-3">You don't have any saved jobs yet.</p>
                    <Button type="button" variant="primary" onClick={() => setShowJobModal(true)}>
                      Create your first job
                    </Button>
                  </div>
                ) : (
                  <>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Saved Jobs
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      required
                    >
                      <option value="">-- Select a saved job --</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.job_title}
                          {job.company_name ? ` · ${job.company_name}` : ''}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {selectedJob && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm font-medium">Role</span>
                      </div>
                      <p className="text-slate-900 font-semibold">{selectedJob.job_title}</p>
                    </div>

                    {selectedJob.company_name && (
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Building className="w-4 h-4" />
                          <span className="text-sm font-medium">Company</span>
                        </div>
                        <p className="text-slate-900 font-semibold">{selectedJob.company_name}</p>
                      </div>
                    )}
                  </div>

                  {selectedJob.focus_areas?.length ? (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Focus Areas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.focus_areas.map(area => (
                          <span
                            key={area}
                            className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white text-slate-700"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Job Description</p>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 max-h-72 overflow-y-auto text-sm text-slate-700 whitespace-pre-line">
                      {selectedJob.job_description}
                    </div>
                  </div>
                </div>
              )}
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
                disabled={loading || !selectedJob}
                loading={loading}
                variant="primary"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {showJobModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Create Job</p>
                <h3 className="text-lg font-semibold text-slate-900">Save a new job description</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                    maxLength={120}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                    rows={8}
                    maxLength={5000}
                    placeholder="Paste the job description here..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{newJobDescription.length}/5000 characters</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newJobCompany}
                      onChange={(e) => setNewJobCompany(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Focus Areas (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newJobFocusAreas}
                      onChange={(e) => setNewJobFocusAreas(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="AWS, Kubernetes, Leadership..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowJobModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isCreatingJob}>
                  {isCreatingJob ? 'Saving...' : 'Save Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
