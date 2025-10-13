import { lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { semantic, gradients, shadows } from '../../utils/colors';
import type { Student } from '../../types';
import { ReadinessBreakdown } from './ReadinessBreakdown';
import { AIFeedbackCard } from './AIFeedbackCard';
import { TranscriptSnippets } from './TranscriptSnippets';
import { RecommendationsPanel } from './RecommendationsPanel';
import { recommendations } from '../../data/mock-data';

const InterviewInsights = lazy(() => import('./InterviewInsights').then(module => ({ default: module.InterviewInsights })));
const InterviewReportsPanel = lazy(() => import('../interview-reports/InterviewReportsPanel').then(module => ({ default: module.InterviewReportsPanel })));

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
}

export function StudentDetailView({ student, onBack }: StudentDetailViewProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 ${semantic.textSecondary} hover:text-[#102c64] transition-colors`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Students</span>
      </button>

      <div className={`bg-gradient-to-r ${gradients.tertiary} rounded-2xl ${shadows.lg} p-8 text-white`}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
            {getInitials(student.name)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            <p className="text-white/90 text-lg">{student.role}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-1">{student.readinessScore}</div>
            <div className="text-white/90 text-sm">Average Readiness Score</div>
            <div className="text-white/80 text-xs mt-2">Last updated: {student.lastInterviewDate}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ReadinessBreakdown competencies={student.competencies} />
          
          <Suspense fallback={
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-center h-32">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              </div>
            </div>
          }>
            <InterviewInsights 
              interviewCount={student.interviewCount}
              improvement={student.improvement}
              averageDuration={student.averageDuration}
              confidenceTrend={student.confidenceTrend}
            />
          </Suspense>

          {student.aiFeedback && (
            <AIFeedbackCard feedback={student.aiFeedback} />
          )}

          {student.transcriptSnippets && (
            <TranscriptSnippets 
              early={student.transcriptSnippets.early}
              recent={student.transcriptSnippets.recent}
            />
          )}

          {student.interviewReports && student.interviewReports.length > 0 && (
            <Suspense fallback={
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-center h-32">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                </div>
              </div>
            }>
              <InterviewReportsPanel reports={student.interviewReports} />
            </Suspense>
          )}
        </div>

        <div className="xl:col-span-1">
          <RecommendationsPanel recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}
