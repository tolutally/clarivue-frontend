import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Loader2,
  Home,
  RotateCcw,
  Clock,
  MessageSquare,
  Download,
  Briefcase,
  Building,
  TrendingUp,
  AlertTriangle,
  Target,
  FileText,
  Sparkles,
  Users,
} from 'lucide-react';
import { aiSessionsService, type CloseSessionResponse } from '@/services/aiSessions/aiSessions.service';
import { analysisService, type AnalysisResponse } from '@/services/analysis/analysis.service';

export function SessionCompletePage() {
  const { sessionData, clearSession } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [closeData, setCloseData] = useState<CloseSessionResponse | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('ai_session_id');
    console.log('Retrieved session ID from localStorage:', storedSessionId);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
      closeSession(storedSessionId);
    } else {
      setError('Session ID not found');
      setIsLoading(false);
    }
  }, []);

  const closeSession = async (sessionIdToClose: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Closing session with ID:', sessionIdToClose);
      
      const storedElapsedRaw = localStorage.getItem('session_elapsed_seconds');
      const storedElapsed = storedElapsedRaw ? parseInt(storedElapsedRaw, 10) : null;

      // Close session - this returns transcript, duration, context
      const serverCloseResponse = await aiSessionsService.closeSession(sessionIdToClose);
      const closeResponse = {
        ...serverCloseResponse,
        actual_duration:
          typeof storedElapsed === 'number' && !Number.isNaN(storedElapsed)
            ? storedElapsed
            : serverCloseResponse.actual_duration,
      };
      setCloseData(closeResponse);
      console.log('Session closed with data:', closeResponse);

      setIsLoading(false);

      // Start fetching analysis in background
      if (sessionData?.session_log_id) {
        fetchAnalysis(sessionData.session_log_id);
      }
    } catch (err: any) {
      console.error('Failed to close session:', err);
      const errorMsg = err?.message || 'Failed to close session';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const fetchAnalysis = async (sessionLogId: string) => {
    try {
      setIsLoadingAnalysis(true);
      setAnalysisError(null);

      // Wait for analysis to be ready (polls until available)
      const analysisData = await analysisService.waitForAnalysis(sessionLogId, 60000, 2000);
      setAnalysis(analysisData);
      console.log('Analysis fetched:', analysisData);
    } catch (err: any) {
      console.error('Failed to fetch analysis:', err);
      setAnalysisError(err?.message || 'Analysis is still processing. Please check back later.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const downloadTranscript = () => {
    if (!closeData?.transcript) return;

    const transcriptText = closeData.transcript
      .map((msg) => {
        const timestamp = new Date(msg.timestamp).toLocaleTimeString();
        const speaker = msg.speaker || (msg.role === 'user' ? 'You' : 'AI');
        return `[${timestamp}] ${speaker}: ${msg.content}`;
      })
      .join('\n\n');

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${sessionId || 'session'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDetectedSkill = (
    skill: string | { name: string; status?: string }
  ): { label: string; colorClass: string } | null => {
    if (!skill) return null;

    const base = typeof skill === 'string' ? { name: skill, status: undefined } : skill;
    const normalizedStatus = base.status?.toLowerCase();

    let colorClass = 'bg-slate-100 text-slate-700';
    if (normalizedStatus === 'confidentlydiscussed') {
      colorClass = 'bg-emerald-100 text-emerald-800';
    } else if (normalizedStatus === 'mentioned') {
      colorClass = 'bg-blue-100 text-blue-800';
    } else if (normalizedStatus === 'missing') {
      colorClass = 'bg-red-100 text-red-700';
    }

    const statusLabel = base.status ? ` • ${base.status.replace(/([A-Z])/g, ' $1').trim()}` : '';

    return {
      label: `${base.name}${statusLabel}`,
      colorClass,
    };
  };

  const formatMentionedSkill = (
    skill:
      | string
      | {
          name: string;
          level?: string | null;
          time?: string | null;
          status?: string | null;
        }
  ): { label: string; colorClass: string } | null => {
    if (!skill) return null;

    const base =
      typeof skill === 'string'
        ? { name: skill, level: null, time: null, status: null }
        : skill;

    const level = base.level?.toLowerCase();
    const status = base.status?.toLowerCase();

    let colorClass = 'bg-slate-100 text-slate-700';
    if (level === 'high') {
      colorClass = 'bg-emerald-50 text-emerald-700';
    } else if (level === 'medium') {
      colorClass = 'bg-amber-50 text-amber-700';
    } else if (level === 'low') {
      colorClass = 'bg-blue-50 text-blue-700';
    }
    if (status === 'missing') {
      colorClass = 'bg-red-50 text-red-700';
    }

    const metaParts = [];
    if (base.level) metaParts.push(base.level);
    if (base.time) metaParts.push(base.time);
    if (!base.level && base.status) metaParts.push(base.status);
    const meta: string = metaParts.length ? ` • ${metaParts.join(' / ')}` : '';

    return {
      label: `${base.name}${meta}`,
      colorClass,
    };
  };

  const isFormattedSkill = (
    skill: { label: string; colorClass: string } | null
  ): skill is { label: string; colorClass: string } => Boolean(skill);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number, benchmark: number) => {
    const percentage = (score / benchmark) * 100;
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number, benchmark: number) => {
    const percentage = (score / benchmark) * 100;
    if (percentage >= 80) return 'bg-emerald-50 border-emerald-200';
    if (percentage >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const handleStartNewSession = () => {
    const originalToken = sessionData?.original_token;
    if (originalToken) {
      window.location.href = `/session/join?token=${originalToken}`;
    } else {
      setError('Unable to start new session. Missing token.');
    }
  };

  const handleGoHome = () => {
    clearSession();
    localStorage.removeItem('session_access_token');
    window.location.href = '/login';
  };

  const sessionsRemaining = sessionData?.sessions_remaining ?? 0;
  const hasMoreSessions = sessionsRemaining > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="pt-12 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Session Complete</h1>
            <p className="text-slate-600">Your interview has been saved and analyzed.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> {error}
              </p>
            </div>
          )}

          {/* Session Summary */}
          {closeData && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Session Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Duration</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatDuration(closeData.actual_duration)} / {formatDuration(closeData.duration_seconds)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Sessions Remaining</p>
                    <p className="text-lg font-bold text-slate-900">{sessionsRemaining}</p>
                  </div>
                </div>
              </div>

              {/* Job Context */}
              {closeData.context && (closeData.context.job_title || closeData.context.company_name) && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Interview Context</span>
                  </div>
                  {closeData.context.job_title && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-slate-600">Role:</span>
                      <span className="font-semibold text-slate-900">{closeData.context.job_title}</span>
                    </div>
                  )}
                  {closeData.context.company_name && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-900">{closeData.context.company_name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Session Timeline */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Started:</span>
                  <span className="font-medium text-slate-900">{formatDate(closeData.started_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium text-slate-900">{formatDate(closeData.completed_at)}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Transcript Section */}
          {closeData?.transcript && closeData.transcript.length > 0 && (
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Transcript</h2>
                  <span className="text-sm text-slate-500">({closeData.transcript.length} messages)</span>
                </div>
                <Button
                  onClick={downloadTranscript}
                  variant="outline"
                  size="sm"
                  startIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {closeData.transcript.map((msg, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-20 text-xs text-slate-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-700 mb-1">
                          {msg.speaker || (msg.role === 'user' ? 'You' : 'AI')}
                        </div>
                        <div className="text-slate-600 whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Analysis Section */}
          {isLoadingAnalysis && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-slate-600">Analyzing your interview session...</span>
              </div>
            </Card>
          )}

          {analysisError && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Analysis Not Ready</p>
                  <p className="text-sm text-amber-800">{analysisError}</p>
                </div>
              </div>
            </Card>
          )}

          {analysis && analysis.analysis_data && (
            <>
              {/* Summary */}
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">AI Analysis Summary</h2>
                </div>
                <p className="text-slate-700 mb-4">{analysis.analysis_data.summaryNote}</p>
                <p className="text-slate-600 text-sm">{analysis.analysis_data.aiFeedbackSummary}</p>
              </Card>

              {/* Technical Depth */}
              {analysis.analysis_data.technicalDepthIndex && (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Technical Depth</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-slate-900">
                      {analysis.analysis_data.technicalDepthIndex.score}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700">
                        {analysis.analysis_data.technicalDepthIndex.rating}
                      </div>
                      <div className="text-sm text-slate-600">{analysis.analysis_data.technicalDepthIndex.note}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Top Strengths */}
              {analysis.analysis_data.topStrengths && analysis.analysis_data.topStrengths.length > 0 && (
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">Top Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.analysis_data.topStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Areas of Concern */}
              {analysis.analysis_data.areasOfConcern && analysis.analysis_data.areasOfConcern.length > 0 && (
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-slate-900">Areas of Concern</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.analysis_data.areasOfConcern.map((concern, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Competency Breakdown */}
              {analysis.analysis_data.competencyBreakdown && analysis.analysis_data.competencyBreakdown.length > 0 && (
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-bold text-slate-900">Competency Breakdown</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.analysis_data.competencyBreakdown.map((competency, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${getScoreBgColor(competency.score, competency.benchmark)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{competency.competency}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getScoreColor(competency.score, competency.benchmark)}`}>
                              {competency.score}
                            </span>
                            <span className="text-sm text-slate-500">/ {competency.benchmark}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{competency.description}</p>
                        {competency.evidence && competency.evidence !== 'N/A' && (
                          <p className="text-xs text-slate-500">Evidence: {competency.evidence}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Technical Skills */}
              {(analysis.analysis_data.technicalSkillsDetected ||
                analysis.analysis_data.skillsMentioned) && (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Technical Skills</h3>
                  {analysis.analysis_data.technicalSkillsDetected && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Detected:</h4>
                      <div className="flex flex-wrap gap-2">
                    {[
                      ...(analysis.analysis_data.technicalSkillsDetected.languages || []),
                      ...(analysis.analysis_data.technicalSkillsDetected.tools || []),
                      ...(analysis.analysis_data.technicalSkillsDetected.methods || []),
                    ]
                      .map(formatDetectedSkill)
                      .filter(isFormattedSkill)
                      .map((skill, idx) => (
                        <span
                          key={`${skill.label}-${idx}`}
                          className={`px-3 py-1 rounded-full text-sm ${skill.colorClass}`}
                        >
                          {skill.label}
                        </span>
                      ))}
                      </div>
                    </div>
                  )}
                  {analysis.analysis_data.skillsMentioned && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Mentioned:</h4>
                      <div className="flex flex-wrap gap-2">
                    {[
                      ...(analysis.analysis_data.skillsMentioned.languages || []),
                      ...(analysis.analysis_data.skillsMentioned.tools || []),
                      ...(analysis.analysis_data.skillsMentioned.methods || []),
                    ]
                      .map(formatMentionedSkill)
                      .filter(isFormattedSkill)
                      .map((skill, idx) => (
                        <span
                          key={`${skill.label}-${idx}`}
                          className={`px-3 py-1 rounded-full text-sm ${skill.colorClass}`}
                        >
                          {skill.label}
                        </span>
                      ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Technical Coaching */}
              {analysis.analysis_data.technicalCoaching && (
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-bold text-slate-900">Technical Coaching</h3>
                  </div>
                  <p className="text-slate-700">{analysis.analysis_data.technicalCoaching}</p>
                </Card>
              )}

              {/* Personalized Recommendations */}
              {analysis.analysis_data.personalizedRecommendations &&
                analysis.analysis_data.personalizedRecommendations.length > 0 && (
                  <Card className="p-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Personalized Recommendations</h3>
                    <ul className="space-y-3">
                      {analysis.analysis_data.personalizedRecommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                          </div>
                          <span className="text-slate-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
            </>
          )}

          {/* Action Buttons */}
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
