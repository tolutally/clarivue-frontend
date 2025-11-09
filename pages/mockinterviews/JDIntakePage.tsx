import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Link as LinkIcon, Sparkles, Search, AlertCircle, Loader2 } from 'lucide-react';
import backend from '@/lib/api-client';
import type { SampleJD } from '@/lib/backend-types';

export function JDIntakePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'paste' | 'url' | 'sample'>('paste');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pastedJD, setPastedJD] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [sampleJDs, setSampleJDs] = useState<SampleJD[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingSamples, setLoadingSamples] = useState(false);

  useEffect(() => {
    if (activeTab === 'sample' && sampleJDs.length === 0) {
      loadSampleJDs();
    }
  }, [activeTab]);

  const loadSampleJDs = async () => {
    setLoadingSamples(true);
    try {
      const response = await backend.mockinterviews.getSampleJDs();
      setSampleJDs(response.samples);
    } catch (err) {
      console.error('Failed to load sample JDs:', err);
    } finally {
      setLoadingSamples(false);
    }
  };

  const handleAnalyze = async () => {
    if (!token) {
      setError('Invalid token');
      return;
    }

    let content = '';
    let sourceType: 'pasted' | 'url' | 'sample' = 'pasted';
    let sourceUrl: string | undefined;

    if (activeTab === 'paste') {
      content = pastedJD;
      sourceType = 'pasted';
    } else if (activeTab === 'url') {
      if (!jobUrl.trim()) {
        setError('Please enter a job URL');
        return;
      }
      if (!jobUrl.match(/^https?:\/\/.+/)) {
        setError('Please enter a valid URL starting with http:// or https://');
        return;
      }
      content = `[Job URL: ${jobUrl}]\n\nThis is a placeholder. URL fetching would be implemented here.`;
      sourceType = 'url';
      sourceUrl = jobUrl;
    } else if (activeTab === 'sample') {
      if (!selectedSampleId) {
        setError('Please select a sample job description');
        return;
      }
      const selectedJD = sampleJDs.find(jd => jd.id === selectedSampleId);
      if (!selectedJD) {
        setError('Selected job description not found');
        return;
      }
      content = selectedJD.content;
      sourceType = 'sample';
    }

    if (content.length < 100) {
      setError('Job description must be at least 100 characters. Please provide more detail.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await backend.mockinterviews.parseJD({
        token,
        content,
        sourceType,
        sourceUrl
      });

      if (response.success && response.jdId) {
        navigate(`/mockinterviews/jd-review/${token}?jdId=${response.jdId}`);
      } else {
        setError(response.message || 'Failed to analyze job description');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = sampleJDs.filter(jd =>
    searchQuery === '' ||
    jd.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSamples = filteredSamples.reduce((acc, jd) => {
    if (!acc[jd.category]) {
      acc[jd.category] = [];
    }
    acc[jd.category].push(jd);
    return acc;
  }, {} as Record<string, SampleJD[]>);

  return (
    <OnboardingLayout currentStep={4} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Job Description Intake
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Provide a job description so we can tailor your interview to match the role you're targeting.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="paste">
                <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Paste JD</span>
                <span className="sm:hidden">Paste</span>
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Job URL</span>
                <span className="sm:hidden">URL</span>
              </TabsTrigger>
              <TabsTrigger value="sample">
                <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Sample JD</span>
                <span className="sm:hidden">Sample</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste">
              <div className="space-y-4">
                <div>
                  <label htmlFor="pastedJD" className="sr-only">Job Description Text</label>
                  <Textarea
                    id="pastedJD"
                    placeholder="Paste the full job description here...&#10;&#10;Include the job title, responsibilities, required skills, qualifications, and any other relevant details."
                    value={pastedJD}
                    onChange={(e) => setPastedJD(e.target.value)}
                    rows={12}
                    className="resize-none"
                    aria-describedby="pastedJD-help"
                  />
                  <div id="pastedJD-help" className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Minimum 100 characters
                    </span>
                    <span className={`${
                      pastedJD.length < 100 
                        ? 'text-slate-500 dark:text-slate-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {pastedJD.length} / 100+
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || pastedJD.length < 100}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                      Analyze Job Description
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url">
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong>Note:</strong> Some job boards require authentication or have paywalls. If URL fetching fails, please copy and paste the job description directly.
                    </span>
                  </p>
                </div>
                <div>
                  <label htmlFor="jobUrl" className="sr-only">Job URL</label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://example.com/jobs/software-engineer"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="text-base"
                  />
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !jobUrl.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      Fetching & Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                      Fetch & Analyze
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sample">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" aria-hidden="true" />
                  <Input
                    type="search"
                    placeholder="Search by title or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search sample job descriptions"
                  />
                </div>

                {loadingSamples ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span className="sr-only">Loading sample job descriptions...</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {Object.keys(groupedSamples).length === 0 ? (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        No sample job descriptions found matching your search.
                      </p>
                    ) : (
                      Object.entries(groupedSamples).map(([category, jds]) => (
                        <div key={category}>
                          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            {category}
                          </h3>
                          <div className="space-y-2">
                            {jds.map(jd => (
                              <button
                                key={jd.id}
                                onClick={() => setSelectedSampleId(jd.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                  selectedSampleId === jd.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                                aria-pressed={selectedSampleId === jd.id ? "true" : "false"}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                      {jd.jobTitle}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mt-1 text-xs">
                                      {jd.companyType && (
                                        <span className="text-slate-600 dark:text-slate-400">
                                          {jd.companyType}
                                        </span>
                                      )}
                                      {jd.experienceLevel && (
                                        <span className="text-slate-600 dark:text-slate-400">
                                          • {jd.experienceLevel}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {selectedSampleId === jd.id && (
                                    <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12" aria-hidden="true">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !selectedSampleId}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                      Use This Job Description
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-start pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/mockinterviews/consent/${token}`)}
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
