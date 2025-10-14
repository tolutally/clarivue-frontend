export interface ReportFilters {
  term?: string;
  program?: string;
  rolePack?: string;
  cohort?: string;
  classYear?: string;
  firstGen?: boolean;
  atRisk?: boolean;
  compareMode?: boolean;
  compareFilters?: Partial<ReportFilters>;
}

export interface CohortOutcomesData {
  kpis: {
    avgReadiness: { value: number; delta: number };
    improvementAfter2Mocks: { value: number };
    percentReady: { value: number };
    offerRate: { value: number };
  };
  weeklyReadiness: number[];
  beforeAfter: Array<{ cohort: string; first: number; latest: number }>;
  distribution: Array<{ range: string; count: number }>;
  insights: string[];
}

export interface CapacityData {
  kpis: {
    studentCoverage: { value: number };
    queueTime: { value: number };
    practiceIntensity: { value: number };
    throughput: { value: number };
  };
  funnel: Array<{ stage: string; count: number }>;
  capacityGauge: { actual: number; target: number };
  insights: string[];
}

export interface SkillGapsData {
  heatmap: Array<{
    program: string;
    communication: number;
    problemSolving: number;
    technical: number;
    confidence: number;
    clarity: number;
  }>;
  benchmark: number;
  employerTarget: number;
  callouts: string[];
}

export interface RolePackData {
  roles: Array<{
    role: string;
    percentReady: number;
    avgScore: number;
    biggestGap: string;
    badgeCount: number;
  }>;
}

export interface InterventionData {
  interventions: Array<{ id: string; name: string; date: string }>;
  selectedIntervention?: {
    name: string;
    beforeAfter: {
      communication: number;
      clarity: number;
      redFlagRateBefore: number;
      redFlagRateAfter: number;
      percentReadyChange: number;
    };
  };
}

export const cohortDataMap: Record<string, CohortOutcomesData> = {
  'fall-2025-coop': {
    kpis: {
      avgReadiness: { value: 72, delta: 9 },
      improvementAfter2Mocks: { value: 18 },
      percentReady: { value: 34 },
      offerRate: { value: 22 },
    },
    weeklyReadiness: [62, 65, 68, 70, 72],
    beforeAfter: [
      { cohort: 'Week 1', first: 58, latest: 62 },
      { cohort: 'Week 3', first: 62, latest: 68 },
      { cohort: 'Week 5', first: 68, latest: 72 },
    ],
    distribution: [
      { range: '0-60', count: 142 },
      { range: '61-79', count: 286 },
      { range: '80-100', count: 98 },
    ],
    insights: [
      'Students completing ≥3 mocks are 2.1× likelier to reach 80+ readiness.',
      'Workshops linked to STAR usage lifted communication by +12.',
      'First-gen students show +22 pts improvement after targeted sessions.',
    ],
  },
  'winter-2025-intern': {
    kpis: {
      avgReadiness: { value: 68, delta: 7 },
      improvementAfter2Mocks: { value: 16 },
      percentReady: { value: 29 },
      offerRate: { value: 19 },
    },
    weeklyReadiness: [58, 61, 64, 66, 68],
    beforeAfter: [
      { cohort: 'Week 1', first: 55, latest: 58 },
      { cohort: 'Week 3', first: 58, latest: 64 },
      { cohort: 'Week 5', first: 64, latest: 68 },
    ],
    distribution: [
      { range: '0-60', count: 168 },
      { range: '61-79', count: 254 },
      { range: '80-100', count: 78 },
    ],
    insights: [
      'Winter cohort shows strong improvement with peer practice sessions.',
      'Technical interview prep drives +15 pts in problem-solving scores.',
      'Students paired with industry mentors show 28% higher offer rates.',
    ],
  },
  'spring-2025-fulltime': {
    kpis: {
      avgReadiness: { value: 76, delta: 11 },
      improvementAfter2Mocks: { value: 21 },
      percentReady: { value: 41 },
      offerRate: { value: 26 },
    },
    weeklyReadiness: [66, 69, 72, 74, 76],
    beforeAfter: [
      { cohort: 'Week 1', first: 62, latest: 66 },
      { cohort: 'Week 3', first: 66, latest: 72 },
      { cohort: 'Week 5', first: 72, latest: 76 },
    ],
    distribution: [
      { range: '0-60', count: 112 },
      { range: '61-79', count: 298 },
      { range: '80-100', count: 128 },
    ],
    insights: [
      'Spring full-time seekers show highest engagement with 3.2 mocks per student.',
      'Behavioral question practice correlates with +19 pts in confidence.',
      'Alumni mock interviewers boost realism and student performance by 14%.',
    ],
  },
  'summer-2025-coop': {
    kpis: {
      avgReadiness: { value: 70, delta: 8 },
      improvementAfter2Mocks: { value: 17 },
      percentReady: { value: 32 },
      offerRate: { value: 21 },
    },
    weeklyReadiness: [60, 63, 66, 68, 70],
    beforeAfter: [
      { cohort: 'Week 1', first: 56, latest: 60 },
      { cohort: 'Week 3', first: 60, latest: 66 },
      { cohort: 'Week 5', first: 66, latest: 70 },
    ],
    distribution: [
      { range: '0-60', count: 155 },
      { range: '61-79', count: 272 },
      { range: '80-100', count: 88 },
    ],
    insights: [
      'Summer cohort benefits from condensed 4-week prep schedule.',
      'Video interview practice reduces nervousness by 34%.',
      'Quick-response drills improve clarity scores by +11 pts.',
    ],
  },
  'fall-2024-coop': {
    kpis: {
      avgReadiness: { value: 69, delta: 6 },
      improvementAfter2Mocks: { value: 15 },
      percentReady: { value: 30 },
      offerRate: { value: 20 },
    },
    weeklyReadiness: [59, 62, 65, 67, 69],
    beforeAfter: [
      { cohort: 'Week 1', first: 54, latest: 59 },
      { cohort: 'Week 3', first: 59, latest: 65 },
      { cohort: 'Week 5', first: 65, latest: 69 },
    ],
    distribution: [
      { range: '0-60', count: 162 },
      { range: '61-79', count: 264 },
      { range: '80-100', count: 82 },
    ],
    insights: [
      'Fall 2024 cohort established baseline metrics for program improvements.',
      'Post-cohort surveys reveal 82% student satisfaction with mock process.',
      'Industry feedback sessions added in response to cohort suggestions.',
    ],
  },
};

export const mockCohortOutcomes: CohortOutcomesData = cohortDataMap['fall-2025-coop'];

export const getCohortData = (cohortId: string): CohortOutcomesData => {
  return cohortDataMap[cohortId] || cohortDataMap['fall-2025-coop'];
};

export const mockCapacity: CapacityData = {
  kpis: {
    studentCoverage: { value: 78 },
    queueTime: { value: 21 },
    practiceIntensity: { value: 2.6 },
    throughput: { value: 486 },
  },
  funnel: [
    { stage: 'Invited', count: 1200 },
    { stage: 'Activated', count: 960 },
    { stage: '1st Mock', count: 820 },
    { stage: '2nd Mock', count: 640 },
    { stage: '≥3 Mocks', count: 410 },
    { stage: 'Reviewed', count: 380 },
    { stage: 'Offer', count: 264 },
  ],
  capacityGauge: { actual: 78, target: 85 },
  insights: [
    'Automated feedback cut median queue time from 36h → 21h.',
    'Nudges at day 7 increase ≥2 mock completion by +14%.',
    'Weekend session slots remain underutilized (23% capacity).',
  ],
};

export const mockSkillGaps: SkillGapsData = {
  heatmap: [
    { program: 'Business', communication: 78, problemSolving: 74, technical: 69, confidence: 70, clarity: 76 },
    { program: 'Engineering', communication: 68, problemSolving: 76, technical: 81, confidence: 63, clarity: 70 },
    { program: 'Arts', communication: 82, problemSolving: 69, technical: 62, confidence: 71, clarity: 79 },
    { program: 'Sciences', communication: 71, problemSolving: 78, technical: 76, confidence: 68, clarity: 73 },
    { program: 'Nursing', communication: 75, problemSolving: 72, technical: 71, confidence: 74, clarity: 77 },
  ],
  benchmark: 70,
  employerTarget: 75,
  callouts: [
    'Engineering Confidence −7 vs benchmark.',
    'Business Quantifying Outcomes −6 vs target.',
    'Arts Technical Skills −13 vs employer expectations.',
  ],
};

export const mockRolePack: RolePackData = {
  roles: [
    { role: 'Software Engineer', percentReady: 28, avgScore: 74, biggestGap: 'Communication', badgeCount: 42 },
    { role: 'Data Analyst', percentReady: 36, avgScore: 76, biggestGap: 'Business Context', badgeCount: 58 },
    { role: 'BDR', percentReady: 41, avgScore: 73, biggestGap: 'Confidence', badgeCount: 51 },
    { role: 'Project Coordinator', percentReady: 39, avgScore: 75, biggestGap: 'Technical Skills', badgeCount: 48 },
    { role: 'RN', percentReady: 44, avgScore: 77, biggestGap: 'Problem Solving', badgeCount: 62 },
  ],
};

export const mockIntervention: InterventionData = {
  interventions: [
    { id: '1', name: 'STAR Clinic', date: 'Oct 3, 2025' },
    { id: '2', name: 'Mock Fair', date: 'Sept 18, 2025' },
    { id: '3', name: 'Behavioral Workshop', date: 'Sept 5, 2025' },
    { id: '4', name: 'Tech Interview Bootcamp', date: 'Aug 22, 2025' },
  ],
  selectedIntervention: {
    name: 'STAR Clinic – Oct 3',
    beforeAfter: {
      communication: 12,
      clarity: 7,
      redFlagRateBefore: 14,
      redFlagRateAfter: 6,
      percentReadyChange: 9,
    },
  },
};

export const autoInsights = {
  efficiency: [
    'Advisor reviews within 24h → +7 point avg improvement',
    'First mock within 3 days of signup → +18% completion rate',
  ],
  skillGaps: [
    'Confidence limits Engineering candidates — recommend 3× micro-practice modules',
    'Business candidates strong in communication, weak in technical demos',
  ],
  equity: [
    'First-gen candidates close gap after 2 workshops',
    'Recommend targeted STAR sessions for underrepresented groups',
  ],
};
