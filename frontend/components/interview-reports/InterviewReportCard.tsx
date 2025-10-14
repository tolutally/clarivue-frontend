import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { semantic, shadows, backgrounds, hover, gradients } from '../../utils/colors';
import type { InterviewReport, DetectedSkill } from '../../types';
import { SummaryNote } from './SummaryNote';
import { StrengthsConcerns } from './StrengthsConcerns';
import { CompetencyTable } from './CompetencyTable';
import { TranscriptViewer } from './TranscriptViewer';
import { AIFeedbackRecommendations } from './AIFeedbackRecommendations';
import { AdvisorNotes } from './AdvisorNotes';
import { TechnicalDepthIndex } from './TechnicalDepthIndex';
import { SkillTagsPanel } from './SkillTagsPanel';
import { SkillsMentioned } from './SkillsMentioned';
import backend from '~backend/client';

interface InterviewReportCardProps {
  report: InterviewReport;
}

export function InterviewReportCard({ report }: InterviewReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<DetectedSkill[]>(report.detectedSkills || []);
  const [isDetecting, setIsDetecting] = useState(false);
  const transcriptViewerRef = useRef<{ scrollToTimestamp: (timestamp: string) => void } | null>(null);

  useEffect(() => {
    if (isExpanded && !report.detectedSkills && report.transcript && !isDetecting) {
      setIsDetecting(true);
      backend.skills.detect({ transcript: report.transcript, interviewId: report.id })
        .then(response => {
          setDetectedSkills(response.skills);
        })
        .catch(err => {
          console.error('Failed to detect skills:', err);
        })
        .finally(() => {
          setIsDetecting(false);
        });
    }
  }, [isExpanded, report.transcript, report.detectedSkills, report.id, isDetecting]);

  const handleTimestampClick = (timestamp: string) => {
    transcriptViewerRef.current?.scrollToTimestamp(timestamp);
  };

  return (
    <div className={`${semantic.surface} rounded-xl ${shadows.sm} border ${semantic.border} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between ${hover.primaryLight} transition-colors`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients.tertiary} flex items-center justify-center text-white font-bold`}>
            #{report.interviewNumber}
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${semantic.textPrimary}`}>
              Interview #{report.interviewNumber}
            </h3>
            <div className={`flex items-center gap-3 text-sm ${semantic.textSecondary} mt-1`}>
              <span>{report.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {report.duration} min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-3.5 h-3.5 ${semantic.success}`} />
                {report.completionRate}% completion
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`flex items-center gap-2 px-4 py-2 ${backgrounds.primary} text-white rounded-lg ${hover.primary} transition-colors text-sm font-medium`}
          >
            <ExternalLink className="w-4 h-4" />
            Open Full Report
          </button>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${semantic.textMuted}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${semantic.textMuted}`} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className={`border-t ${semantic.border} p-6 space-y-6 ${semantic.bgSubtle}`}>
          {report.technicalDepthIndex && (
            <TechnicalDepthIndex tdi={report.technicalDepthIndex} />
          )}

          {report.detectedSkills && report.detectedSkills.length > 0 && (
            <SkillTagsPanel skills={report.detectedSkills} />
          )}

          {(detectedSkills.length > 0 || isDetecting) && (
            <div className={`${semantic.surface} rounded-xl p-6 border ${semantic.border}`}>
              {isDetecting ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground">Detecting skills...</span>
                </div>
              ) : (
                <SkillsMentioned 
                  skills={detectedSkills} 
                  onTimestampClick={handleTimestampClick}
                />
              )}
            </div>
          )}

          <SummaryNote note={report.summaryNote} />

          <StrengthsConcerns strengths={report.strengths} concerns={report.concerns} />

          <CompetencyTable competencies={report.competencyBreakdown} />

          <div className="flex items-center gap-3">
            <TranscriptViewer 
              ref={transcriptViewerRef}
              transcript={report.transcript}
              interviewNumber={report.interviewNumber}
            />
          </div>

          <AIFeedbackRecommendations 
            summary={report.aiFeedbackSummary}
            recommendations={report.aiRecommendations}
            technicalFeedback={report.technicalFeedback}
          />

          <AdvisorNotes notes={report.advisorNotes} />
        </div>
      )}
    </div>
  );
}
