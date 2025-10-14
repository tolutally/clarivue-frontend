export interface Student {
  id: string;
  name: string;
  role: string;
  readinessScore: number;
  improvement: number;
  feedback: string;
  confidenceTrend: number[];
  competencies: {
    Communication: number;
    'Problem Solving': number;
    Technical: number;
    Confidence: number;
    Clarity: number;
  };
  lastInterviewDate: string;
  interviewCount: number;
  averageDuration: number;
  avatar?: string;
  aiFeedback?: string;
  transcriptSnippets?: {
    early: string;
    recent: string;
  };
  interviewReports?: InterviewReport[];
}

export type StudentFilterType = 'all' | 'high-readiness' | 'improving' | 'needs-support' | string;

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface InterviewReport {
  id: string;
  interviewNumber: number;
  date: string;
  duration: number;
  completionRate: number;
  summaryNote: string;
  strengths: string[];
  concerns: string[];
  competencyBreakdown: CompetencyBreakdownItem[];
  transcript: string;
  aiFeedbackSummary: string;
  aiRecommendations: string[];
  advisorNotes?: AdvisorNote[];
  technicalDepthIndex?: TechnicalDepthIndex;
  detectedSkills?: DetectedSkill[];
  technicalFeedback?: string;
}

export interface CompetencyBreakdownItem {
  competency: string;
  score: number;
  change: number;
  benchmark: number;
  reason?: string;
  evidenceTimestamp?: string;
}


export interface AdvisorNote {
  id: string;
  date: string;
  author: string;
  content: string;
  visibleToStudent: boolean;
}

export interface TechnicalDepthIndex {
  score: number;
  level: 'Low' | 'Moderate' | 'Strong' | 'Advanced';
  insight: string;
}

export interface DetectedSkill {
  skill: string;
  confidence: 'high' | 'mentioned' | 'missing';
  category: string;
  evidenceTimestamp?: string;
}

export interface AuthenticitySignal {
  signal: string;
  status: 'healthy' | 'minor-concern' | 'major-concern';
  type: 'Behavioral' | 'Linguistic' | 'Audio' | 'Cognitive';
  insight: string;
  timestamp?: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  assignedStudents: string[];
  activityMetrics: {
    totalNotes: number;
    reviewsCompleted: number;
    avgResponseTime: number;
    activeStudents: number;
  };
  recentNotes: {
    id: string;
    studentId: string;
    studentName: string;
    date: string;
    content: string;
  }[];
  specializations: string[];
  contactEmail: string;
}
