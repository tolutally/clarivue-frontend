import type { Student, Recommendation, InterviewReport, Advisor } from '../types';

export const competencies = [
  'Communication',
  'Problem Solving',
  'Technical',
  'Confidence',
  'Clarity',
];

export const sampleInterviewReports: InterviewReport[] = [
  {
    id: 'report-1',
    interviewNumber: 3,
    date: 'Oct 5, 2025',
    duration: 21.8,
    completionRate: 87,
    summaryNote: 'Improved structure and pacing. Responses were more grounded in outcomes, but clarity in quantifying results needs work.',
    strengths: ['Calm under pressure', 'Strong technical clarity', 'Improved STAR storytelling'],
    concerns: ['Overused filler phrases', 'Weak closing statements', 'Missing metrics in examples'],
    competencyBreakdown: [
      { competency: 'Communication', score: 84, change: 6, benchmark: 80, reason: 'Strong STAR storytelling with clear structure', evidenceTimestamp: '4:32 - 6:15' },
      { competency: 'Problem Solving', score: 71, change: 4, benchmark: 78, reason: 'Good problem identification but weak on solution depth', evidenceTimestamp: '8:45 - 10:20' },
      { competency: 'Technical', score: 76, change: 3, benchmark: 82, reason: 'Clear technical explanations but lacked depth in complex scenarios', evidenceTimestamp: '12:10 - 14:30' },
      { competency: 'Confidence', score: 65, change: 9, benchmark: 75, reason: 'Improved tone and reduced hesitation compared to previous sessions', evidenceTimestamp: '2:15 - 18:40' },
      { competency: 'Clarity', score: 80, change: 7, benchmark: 79, reason: 'Articulated ideas clearly with minimal filler words', evidenceTimestamp: '5:20 - 7:10' }
    ],
    transcript: `Q: Tell me about a time you faced a challenging situation at work.\nA: The primary challenge involved analyzing complex customer data sets and presenting actionable insights to C-level stakeholders. I used the STAR framework: first, I identified the Situation where our customer retention was declining by 15%. My Task was to uncover root causes. I took Action by segmenting customer cohorts and running churn analysis, which revealed that onboarding delays were the key driver. The Result was a 23% improvement in retention after we streamlined the process.\n\nQ: How do you handle pressure?\nA: Um, I think I handle it pretty well. I usually, you know, try to stay calm and focus on what needs to be done. I prioritize tasks and make sure I'm not overwhelmed...`,
    aiFeedbackSummary: 'Your confidence improved by 17% and pacing stabilized after question 3. You demonstrated clear reasoning and examples for teamwork scenarios but struggled with quantifying outcomes. Focus on specific metrics next round.',
    aiRecommendations: [
      'Rehearse STAR story with measurable results',
      'Practice closing questions to strengthen rapport',
      'Slow speech pacing by 10% for clarity'
    ],
    advisorNotes: [
      {
        id: 'note-1',
        date: 'Oct 6, 2025',
        author: 'Dr. Emily Roberts',
        content: 'Reviewed with Jane on Oct 6. Assigned 2 follow-up mocks focused on quantitative storytelling.',
        visibleToStudent: true
      }
    ],
    technicalDepthIndex: {
      score: 76,
      level: 'Strong',
      insight: 'Strong conceptual understanding of data analytics tools and methodologies. Clear articulation of SQL queries and cohort analysis. Needs more depth on statistical methods and A/B testing frameworks.'
    },
    detectedSkills: [
      { skill: 'Python', confidence: 'high', category: 'Languages', evidenceTimestamp: '8:20' },
      { skill: 'SQL', confidence: 'high', category: 'Languages', evidenceTimestamp: '9:45' },
      { skill: 'Tableau', confidence: 'high', category: 'Tools', evidenceTimestamp: '12:30' },
      { skill: 'Excel', confidence: 'high', category: 'Tools', evidenceTimestamp: '6:15' },
      { skill: 'R', confidence: 'mentioned', category: 'Languages', evidenceTimestamp: '14:05' },
      { skill: 'Power BI', confidence: 'mentioned', category: 'Tools', evidenceTimestamp: '13:22' },
      { skill: 'A/B Testing', confidence: 'mentioned', category: 'Methods', evidenceTimestamp: '16:40' },
      { skill: 'Machine Learning', confidence: 'missing', category: 'Methods' },
      { skill: 'Git', confidence: 'missing', category: 'Tools' }
    ],
    technicalFeedback: 'Your SQL and Python explanations were clear and accurate. Consider adding specific examples of statistical significance testing when discussing A/B tests, and be prepared to explain time/space complexity for data processing algorithms.'
  },
  {
    id: 'report-2',
    interviewNumber: 2,
    date: 'Sept 28, 2025',
    duration: 19.5,
    completionRate: 82,
    summaryNote: 'Good foundational understanding but struggled with depth. Improved confidence from first session but needs work on clarity.',
    strengths: ['Better eye contact', 'Reduced filler words from v1', 'Good energy'],
    concerns: ['Answers too brief', 'Missed follow-up opportunities', 'Lacked specific examples'],
    competencyBreakdown: [
      { competency: 'Communication', score: 78, change: 10, benchmark: 80, reason: 'Better eye contact and reduced filler words, but answers still too brief', evidenceTimestamp: '1:30 - 5:45' },
      { competency: 'Problem Solving', score: 67, change: 8, benchmark: 78, reason: 'Described problem but lacked analytical depth in solution', evidenceTimestamp: '7:20 - 9:10' },
      { competency: 'Technical', score: 73, change: 5, benchmark: 82, reason: 'Basic technical concepts explained but missing advanced details', evidenceTimestamp: '10:30 - 12:00' },
      { competency: 'Confidence', score: 56, change: 12, benchmark: 75, reason: 'Significant improvement from session 1, less nervous energy', evidenceTimestamp: 'Overall session' },
      { competency: 'Clarity', score: 73, change: 9, benchmark: 79, reason: 'Clearer articulation but needs more specific examples', evidenceTimestamp: '3:40 - 8:20' }
    ],
    transcript: `Q: Describe a project where you had to collaborate with multiple teams.\nA: Well, um, I worked on a project where we had to work with marketing and engineering. It was challenging because everyone had different priorities. I tried to organize meetings and keep everyone aligned.\n\nQ: What was the outcome?\nA: It went well. We launched on time and the stakeholders were happy.`,
    aiFeedbackSummary: 'Confidence is building — great progress from session 1. You need to add depth and specific outcomes to your stories. Practice adding quantitative results.',
    aiRecommendations: [
      'Add specific metrics to each STAR answer',
      'Prepare 3-5 detailed stories with outcomes',
      'Practice delivering longer, more detailed responses'
    ],
    technicalDepthIndex: {
      score: 62,
      level: 'Moderate',
      insight: 'Demonstrates foundational knowledge of data tools and concepts. Mentioned SQL and Excel but lacked depth in explaining complex queries or advanced analytics techniques. Growing comfort with technical terminology.'
    },
    detectedSkills: [
      { skill: 'Python', confidence: 'mentioned', category: 'Languages', evidenceTimestamp: '7:15' },
      { skill: 'SQL', confidence: 'high', category: 'Languages', evidenceTimestamp: '8:30' },
      { skill: 'Excel', confidence: 'high', category: 'Tools', evidenceTimestamp: '5:45' },
      { skill: 'Tableau', confidence: 'mentioned', category: 'Tools', evidenceTimestamp: '11:20' },
      { skill: 'R', confidence: 'missing', category: 'Languages' },
      { skill: 'Power BI', confidence: 'missing', category: 'Tools' },
      { skill: 'A/B Testing', confidence: 'missing', category: 'Methods' },
      { skill: 'Machine Learning', confidence: 'missing', category: 'Methods' },
      { skill: 'Git', confidence: 'missing', category: 'Tools' }
    ],
    technicalFeedback: 'Good progress on SQL fundamentals. When discussing data analysis, add more technical specifics: which SQL joins you used, data volume you handled, or optimization techniques you applied. Practice explaining your Python code line-by-line.'
  },
  {
    id: 'report-3',
    interviewNumber: 1,
    date: 'Sept 24, 2025',
    duration: 17.2,
    completionRate: 75,
    summaryNote: 'First session baseline. Noticeable nervousness and lack of structure. Clear potential with focused practice.',
    strengths: ['Friendly demeanor', 'Willing to learn', 'Good listening skills'],
    concerns: ['High filler word usage', 'Unstructured responses', 'Low confidence', 'Missed STAR framework'],
    competencyBreakdown: [
      { competency: 'Communication', score: 68, change: 0, benchmark: 80, reason: 'Baseline session - high filler word usage and unstructured responses', evidenceTimestamp: '0:45 - 4:20' },
      { competency: 'Problem Solving', score: 59, change: 0, benchmark: 78, reason: 'Mentioned problem but no clear solution or framework applied', evidenceTimestamp: '6:10 - 8:30' },
      { competency: 'Technical', score: 68, change: 0, benchmark: 82, reason: 'Basic understanding shown but lacked depth and specificity', evidenceTimestamp: '9:00 - 11:15' },
      { competency: 'Confidence', score: 44, change: 0, benchmark: 75, reason: 'Evident nervousness, frequent pauses, and uncertain tone throughout', evidenceTimestamp: 'Overall session' },
      { competency: 'Clarity', score: 64, change: 0, benchmark: 79, reason: 'Frequent filler words and vague language reduced clarity', evidenceTimestamp: '2:15 - 12:40' }
    ],
    transcript: `Q: Tell me about yourself.\nA: Um, so I'm Jane, and I, like, studied business analytics. I've worked on a few projects, you know, with data and stuff. I think I'm pretty good at problem solving.\n\nQ: Can you give me an example?\nA: Um, well, there was this one time where we had to, like, analyze some customer data. It was pretty tough because, you know, there was a lot of information and we had to present it to our manager.`,
    aiFeedbackSummary: 'Baseline established. Focus on building confidence and learning the STAR framework. Practice structured storytelling with clear situation, task, action, and result.',
    aiRecommendations: [
      'Learn and practice STAR framework',
      'Reduce filler words through slow, deliberate speech',
      'Record yourself answering common behavioral questions'
    ],
    advisorNotes: [
      {
        id: 'note-2',
        date: 'Sept 25, 2025',
        author: 'Dr. Emily Roberts',
        content: 'Strong baseline. Jane shows great potential. Assigned STAR framework workshop and 2 practice sessions.',
        visibleToStudent: true
      }
    ],
    technicalDepthIndex: {
      score: 45,
      level: 'Low',
      insight: 'Baseline assessment shows familiarity with Excel and basic data analysis. Vague references to technical tools without concrete examples. Significant room for growth in articulating technical processes and methodologies.'
    },
    detectedSkills: [
      { skill: 'Excel', confidence: 'mentioned', category: 'Tools', evidenceTimestamp: '4:50' },
      { skill: 'SQL', confidence: 'mentioned', category: 'Languages', evidenceTimestamp: '10:05' },
      { skill: 'Python', confidence: 'missing', category: 'Languages' },
      { skill: 'R', confidence: 'missing', category: 'Languages' },
      { skill: 'Tableau', confidence: 'missing', category: 'Tools' },
      { skill: 'Power BI', confidence: 'missing', category: 'Tools' },
      { skill: 'A/B Testing', confidence: 'missing', category: 'Methods' },
      { skill: 'Machine Learning', confidence: 'missing', category: 'Methods' },
      { skill: 'Git', confidence: 'missing', category: 'Tools' }
    ],
    technicalFeedback: 'Build your technical vocabulary. When you mention "analyzing data," specify the tools (Excel formulas, SQL queries, Python libraries) and methods (regression, cohort analysis, visualization) you used. Practice explaining one technical project in detail.'
  }
];

export const students: Student[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'Business Analyst',
    readinessScore: 78,
    improvement: 14,
    feedback: 'Clear answers but tends to rush; improved STAR storytelling.',
    confidenceTrend: [65, 70, 74, 78],
    competencies: {
      Communication: 84,
      'Problem Solving': 70,
      Technical: 76,
      Confidence: 65,
      Clarity: 80,
    },
    lastInterviewDate: 'Oct 5, 2025',
    interviewCount: 3,
    averageDuration: 21.8,
    aiFeedback: 'Strong technical understanding 🧠. Improve pacing — you spoke 30% faster than average. STAR storytelling improved by +22% after second mock.',
    transcriptSnippets: {
      early: 'Um, so I think... like, the main challenge was we had to, you know, analyze the data and then present it to stakeholders. It was pretty tough because...',
      recent: 'The primary challenge involved analyzing complex customer data sets and presenting actionable insights to C-level stakeholders. I used the STAR framework: first, I identified the Situation where our customer retention was declining by 15%. My Task was to uncover root causes. I took Action by segmenting customer cohorts and running churn analysis, which revealed that onboarding delays were the key driver. The Result was a 23% improvement in retention after we streamlined the process.'
    },
    interviewReports: sampleInterviewReports
  },
  {
    id: '2',
    name: 'Aisha Patel',
    role: 'Software Engineer',
    readinessScore: 68,
    improvement: 21,
    feedback: 'Technical depth good; improve clarity and concise answers.',
    confidenceTrend: [47, 58, 64, 68],
    competencies: {
      Communication: 65,
      'Problem Solving': 78,
      Technical: 85,
      Confidence: 62,
      Clarity: 60,
    },
    lastInterviewDate: 'Oct 4, 2025',
    interviewCount: 4,
    averageDuration: 24.5,
    aiFeedback: 'Excellent technical depth 💻. Work on clarity — answers tend to be overly detailed. Communication improved by +18% in recent sessions.',
    transcriptSnippets: {
      early: 'So basically I wrote this algorithm that does... well it\'s kind of complicated, but essentially it processes the input and outputs the result using recursion and...',
      recent: 'I optimized our search algorithm by implementing a binary search tree with O(log n) lookup time. This reduced average query time from 200ms to 15ms, improving user experience significantly.'
    },
    interviewReports: sampleInterviewReports
  },
  {
    id: '3',
    name: 'Liam Chen',
    role: 'Data Analyst',
    readinessScore: 74,
    improvement: 9,
    feedback: 'Great analysis examples; tone dipped under pressure.',
    confidenceTrend: [65, 68, 72, 74],
    competencies: {
      Communication: 70,
      'Problem Solving': 82,
      Technical: 76,
      Confidence: 68,
      Clarity: 74,
    },
    lastInterviewDate: 'Oct 3, 2025',
    interviewCount: 3,
    averageDuration: 19.2,
    aiFeedback: 'Strong analytical thinking 📊. Maintain composure under pressure questions — confidence dropped 15% when challenged. Practice handling curveballs.',
    transcriptSnippets: {
      early: 'I guess... um, I would probably look at the data and see what patterns emerge. Maybe use Excel or something...',
      recent: 'I would approach this by first defining key metrics, then using Python and SQL to extract relevant data sets. I\'d apply regression analysis to identify correlations and visualize findings in Tableau for stakeholder clarity.'
    },
    interviewReports: sampleInterviewReports
  },
  {
    id: '4',
    name: 'Sarah O\'Connor',
    role: 'Marketing Associate',
    readinessScore: 80,
    improvement: 15,
    feedback: 'Excellent confidence; needs tighter metrics in examples.',
    confidenceTrend: [65, 72, 77, 80],
    competencies: {
      Communication: 88,
      'Problem Solving': 74,
      Technical: 70,
      Confidence: 85,
      Clarity: 83,
    },
    lastInterviewDate: 'Oct 2, 2025',
    interviewCount: 3,
    averageDuration: 20.1,
    aiFeedback: 'Excellent storytelling and confidence 🎯. Strengthen your answers with specific metrics and KPIs — currently 40% below benchmark.',
    transcriptSnippets: {
      early: 'We ran a campaign that was really successful and got a lot of engagement. Everyone was happy with the results.',
      recent: 'I led a multi-channel campaign targeting Gen Z users. We increased Instagram engagement by 47% and achieved a 3.2x ROI. The campaign generated 12,000 qualified leads within 6 weeks.'
    },
    interviewReports: sampleInterviewReports
  },
  {
    id: '5',
    name: 'Daniel Brooks',
    role: 'Project Coordinator',
    readinessScore: 59,
    improvement: 12,
    feedback: 'Structure improving, but lacks confidence when challenged.',
    confidenceTrend: [47, 52, 56, 59],
    competencies: {
      Communication: 62,
      'Problem Solving': 58,
      Technical: 55,
      Confidence: 52,
      Clarity: 63,
    },
    lastInterviewDate: 'Oct 1, 2025',
    interviewCount: 4,
    averageDuration: 18.7,
    aiFeedback: 'Good progress on structure 📈. Build confidence through practice — voice stability drops 25% under pressure. Keep practicing!',
    transcriptSnippets: {
      early: 'Um, I\'m not sure... I think I would maybe ask the team what they think and then we could figure it out together?',
      recent: 'As a project coordinator, I would first assess stakeholder priorities, then create a timeline with clear milestones. I\'d facilitate team alignment meetings and track progress using Jira.'
    },
    interviewReports: sampleInterviewReports
  },
];

export const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Practice Behavioral Questions',
    description: '2 new sets ready',
    icon: 'clipboard'
  },
  {
    id: '2',
    title: 'Join Communication Workshop',
    description: 'Nov 12',
    icon: 'users'
  },
  {
    id: '3',
    title: 'Schedule Advisor Review',
    description: 'Click to Book',
    icon: 'calendar'
  }
];

export const advisors: Advisor[] = [
  {
    id: 'adv-1',
    name: 'Dr. Emily Roberts',
    title: 'Senior Career Advisor',
    assignedStudents: ['1', '5'],
    activityMetrics: {
      totalNotes: 47,
      reviewsCompleted: 23,
      avgResponseTime: 4.2,
      activeStudents: 2
    },
    recentNotes: [
      {
        id: 'note-1',
        studentId: '1',
        studentName: 'Jane Doe',
        date: 'Oct 6, 2025',
        content: 'Reviewed with Jane on Oct 6. Assigned 2 follow-up mocks focused on quantitative storytelling.'
      },
      {
        id: 'note-2',
        studentId: '5',
        studentName: 'Daniel Brooks',
        date: 'Oct 3, 2025',
        content: 'Confidence building exercises assigned. Recommended daily practice with pressure questions.'
      },
      {
        id: 'note-3',
        studentId: '1',
        studentName: 'Jane Doe',
        date: 'Sept 25, 2025',
        content: 'Strong baseline. Jane shows great potential. Assigned STAR framework workshop and 2 practice sessions.'
      }
    ],
    specializations: ['Business Analytics', 'Data Science', 'STAR Method'],
    contactEmail: 'e.roberts@clarivue.edu'
  },
  {
    id: 'adv-2',
    name: 'Marcus Thompson',
    title: 'Technical Interview Coach',
    assignedStudents: ['2', '3'],
    activityMetrics: {
      totalNotes: 38,
      reviewsCompleted: 19,
      avgResponseTime: 3.8,
      activeStudents: 2
    },
    recentNotes: [
      {
        id: 'note-4',
        studentId: '2',
        studentName: 'Aisha Patel',
        date: 'Oct 5, 2025',
        content: 'Excellent technical progression. Work on brevity and concise communication. Assigned clarity drills.'
      },
      {
        id: 'note-5',
        studentId: '3',
        studentName: 'Liam Chen',
        date: 'Oct 4, 2025',
        content: 'Strong analytical skills. Practice pressure scenarios more frequently to build resilience.'
      },
      {
        id: 'note-6',
        studentId: '2',
        studentName: 'Aisha Patel',
        date: 'Sept 28, 2025',
        content: 'System design understanding is strong. Focus on communicating technical concepts simply.'
      }
    ],
    specializations: ['Software Engineering', 'Data Analytics', 'Technical Communication'],
    contactEmail: 'm.thompson@clarivue.edu'
  },
  {
    id: 'adv-3',
    name: 'Jennifer Wu',
    title: 'Career Development Specialist',
    assignedStudents: ['4'],
    activityMetrics: {
      totalNotes: 29,
      reviewsCompleted: 15,
      avgResponseTime: 5.1,
      activeStudents: 1
    },
    recentNotes: [
      {
        id: 'note-7',
        studentId: '4',
        studentName: "Sarah O'Connor",
        date: 'Oct 2, 2025',
        content: 'Outstanding confidence and storytelling. Next focus: quantitative metrics and ROI evidence.'
      },
      {
        id: 'note-8',
        studentId: '4',
        studentName: "Sarah O'Connor",
        date: 'Sept 20, 2025',
        content: 'Natural communicator with strong presence. Assigned practice set focused on data-driven answers.'
      }
    ],
    specializations: ['Marketing', 'Communications', 'Behavioral Interviews'],
    contactEmail: 'j.wu@clarivue.edu'
  },
  {
    id: 'adv-4',
    name: 'David Martinez',
    title: 'Interview Strategy Advisor',
    assignedStudents: [],
    activityMetrics: {
      totalNotes: 15,
      reviewsCompleted: 8,
      avgResponseTime: 6.5,
      activeStudents: 0
    },
    recentNotes: [],
    specializations: ['Finance', 'Consulting', 'Case Interviews'],
    contactEmail: 'd.martinez@clarivue.edu'
  }
];
