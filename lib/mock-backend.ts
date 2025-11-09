// Mock backend client for frontend-only development
// This file provides mock data and stub functions to replace the Encore backend

import type { BackendClient } from './backend-types';
import type { CohortStudent } from '../types/cohort';

// LocalStorage keys
const STORAGE_KEYS = {
  COHORTS: 'clarivue_cohorts',
  COHORT_STUDENTS: 'clarivue_cohort_students',
};

// In-memory storage for mock data
const mockCohortStudents: Record<string, CohortStudent[]> = {};

// Load data from localStorage
function loadFromStorage() {
  try {
    const cohortsData = localStorage.getItem(STORAGE_KEYS.COHORTS);
    const studentsData = localStorage.getItem(STORAGE_KEYS.COHORT_STUDENTS);
    
    if (studentsData) {
      const parsed = JSON.parse(studentsData);
      Object.assign(mockCohortStudents, parsed);
    }
    
    return cohortsData ? JSON.parse(cohortsData) : [];
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return [];
  }
}

// Save data to localStorage
function saveCohortsToStorage(cohorts: any[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.COHORTS, JSON.stringify(cohorts));
  } catch (err) {
    console.error('Failed to save cohorts to localStorage:', err);
  }
}

function saveStudentsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.COHORT_STUDENTS, JSON.stringify(mockCohortStudents));
  } catch (err) {
    console.error('Failed to save students to localStorage:', err);
  }
}

export const mockBackend: BackendClient = {
  auth: {
    login: async ({ email, password }: { email: string; password: string }) => {
      // Mock login - in a real app, this would connect to your backend
      return {
        token: 'mock-token',
        admin: {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'admin',
        },
      };
    },
    verifyMagicLink: async ({ token }: { token: string }) => {
      return {
        token: 'mock-token',
        admin: {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'admin',
        },
      };
    },
    requestMagicLink: async ({ email }: { email: string }) => {
      console.log('Mock: Magic link requested for', email);
      return { success: true };
    },
    me: async () => {
      return {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
      };
    },
    verifyInvite: async ({ token }: { token: string }) => {
      console.log('Mock: Invite verified for token', token);
      return {
        valid: true,
        email: 'demo@example.com',
        firstName: '',
        lastName: '',
      };
    },
    completeOnboarding: async (data: any) => {
      console.log('Mock: Onboarding completed', data);
      return {
        token: 'mock-token',
        admin: {
          id: '1',
          email: data.email || 'demo@example.com',
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'admin',
        },
      };
    },
  },
  cohorts: {
    list: async () => {
      // Return mock cohorts list from localStorage with computed stats
      const cohorts = loadFromStorage();
      return cohorts.map((cohort: any) => {
        const students = mockCohortStudents[cohort.id] || [];
        const invited = students.filter((s: CohortStudent) => s.status !== 'added').length;
        const joined = students.filter((s: CohortStudent) => s.status === 'invited' || s.status === 'in-progress' || s.status === 'completed').length;
        const started = students.filter((s: CohortStudent) => s.status === 'in-progress' || s.status === 'completed').length;
        const completed = students.filter((s: CohortStudent) => s.status === 'completed').length;
        
        return {
          ...cohort,
          stats: {
            invited,
            joined,
            started,
            completed,
          },
          lastActivity: students.length > 0 ? new Date() : null,
        };
      });
    },
    get: async ({ id }: { id: string }) => {
      // Return mock cohort with students from localStorage
      const cohorts = loadFromStorage();
      const cohort = cohorts.find((c: any) => c.id === id);
      
      if (!cohort) {
        return {
          id,
          name: 'Mock Cohort',
          description: 'A mock cohort for testing',
          tags: null,
          objectives: null,
          students: mockCohortStudents[id] || [],
        };
      }
      
      return {
        ...cohort,
        students: mockCohortStudents[id] || [],
      };
    },
    create: async (data: any) => {
      // Create and save cohort to localStorage
      const cohorts = loadFromStorage();
      const newCohort = {
        id: `cohort-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      cohorts.push(newCohort);
      saveCohortsToStorage(cohorts);
      
      console.log('Mock: Created cohort', newCohort);
      return newCohort;
    },
    addStudents: async ({ cohortId, students }: { cohortId: string; students: Array<{ email: string; name: string }> }) => {
      // Mock adding students to the cohort
      if (!mockCohortStudents[cohortId]) {
        mockCohortStudents[cohortId] = [];
      }
      
      const newStudents: CohortStudent[] = students.map((s, index) => ({
        id: `student-${Date.now()}-${index}`,
        email: s.email,
        name: s.name,
        status: 'added',
      }));
      
      mockCohortStudents[cohortId].push(...newStudents);
      saveStudentsToStorage();
      
      console.log(`Mock: Added ${students.length} students to cohort ${cohortId}`);
      return {
        success: true,
        message: `Successfully added ${students.length} students`,
      };
    },
    sendInvites: async ({ cohortId, studentIds, timeLimit, numberOfInterviews }: { 
      cohortId: string; 
      studentIds: string[]; 
      timeLimit: number; 
      numberOfInterviews: number 
    }) => {
      // Mock sending invites to students
      if (!mockCohortStudents[cohortId]) {
        return {
          success: false,
          message: 'Cohort not found',
        };
      }
      
      // Update student statuses
      mockCohortStudents[cohortId] = mockCohortStudents[cohortId].map(student => {
        if (studentIds.includes(student.id)) {
          return {
            ...student,
            status: 'invited' as const,
            invitedAt: new Date(),
            totalInterviews: numberOfInterviews,
            completedInterviews: 0,
            timeLimit,
          };
        }
        return student;
      });
      
      saveStudentsToStorage();
      
      console.log(`Mock: Sent invites to ${studentIds.length} students in cohort ${cohortId}`);
      console.log(`Mock: Time limit: ${timeLimit} min, Interviews: ${numberOfInterviews}`);
      
      return {
        success: true,
        message: `Successfully sent invites to ${studentIds.length} students`,
      };
    },
  },
  mockinterviews: {
    verifyToken: async ({ token }: { token: string }) => {
      return {
        valid: true,
        currentStep: 'welcome',
        student: {
          id: 1,
          name: 'Demo Student',
          email: 'student@example.com',
          institution: 'Demo University',
          cohortName: 'Fall 2024',
        },
      };
    },
    submitConsent: async (data: any) => {
      console.log('Mock: Consent submitted', data);
      return { success: true };
    },
    getSampleJDs: async () => {
      return {
        samples: [
          {
            id: '1',
            title: 'Software Engineer',
            company: 'Demo Corp',
            description: 'Sample job description',
            jobTitle: 'Software Engineer',
            category: 'Engineering',
            companyType: 'Startup',
            experienceLevel: 'Mid-Level',
            content: 'Full job description content here...',
          },
        ],
      };
    },
    parseJD: async (data: any) => {
      console.log('Mock: JD parsed', data);
      return { success: true, jdId: 'mock-jd-123' };
    },
    getJDMetrics: async (data: any) => {
      return {
        success: true,
        jobTitle: 'Software Engineer',
        companyName: 'Demo Corp',
        metrics: [
          {
            id: '1',
            type: 'technical_skill',
            name: 'JavaScript',
            value: 'JavaScript',
            confidence: 0.9,
            isStudentAdded: false,
          },
          {
            id: '2',
            type: 'soft_skill',
            name: 'Communication',
            value: 'Communication',
            confidence: 0.8,
            isStudentAdded: false,
          },
        ],
      };
    },
    updateJDMetrics: async (data: any) => {
      console.log('Mock: JD metrics updated', data);
      return { success: true };
    },
    completeProfile: async (data: any) => {
      console.log('Mock: Profile completed', data);
      return { success: true };
    },
    createInterviewSession: async (data: any) => {
      console.log('Mock: Interview session created', data);
      return { success: true, sessionId: 'mock-session-id', sessionUrl: '/mockinterviews/session/mock-session-id' };
    },
  },
  
  // Interview endpoints for student-facing WebRTC interview flow
  interviews: {
    validateInvite: async (token: string) => {
      console.log('Mock: Validating invite token:', token);
      // Simulate token validation
      if (token === 'invalid') {
        return { valid: false, message: 'This invite link is invalid or has expired.' };
      }
      return { 
        valid: true, 
        sessionId: `session-${Date.now()}`,
        message: 'Invite is valid' 
      };
    },
    submitProfile: async (sessionId: string, data: {
      phoneNumber?: string;
      targetRole: string;
      industryFocus?: string;
      experienceLevel?: string;
      careerGoals?: string;
      biggestChallenge?: string;
    }) => {
      console.log('Mock: Submitting profile for', sessionId, data);
      localStorage.setItem(`session-${sessionId}-profile`, JSON.stringify(data));
      return { ok: true };
    },
    submitConsent: async (sessionId: string, data: {
      consentGiven: boolean;
      dataProcessingConsent: boolean;
      recordingConsent: boolean;
    }) => {
      console.log('Mock: Submitting consent for', sessionId, data);
      localStorage.setItem(`session-${sessionId}-consent`, JSON.stringify(data));
      return { ok: true };
    },
    setupSession: async (sessionId: string, data: { 
      roleTitle: string; 
      jobDescription: string;
      resume?: {
        fileName: string;
        fileType: string;
        fileSize: number;
        data: string;
      };
    }) => {
      console.log('Mock: Setting up session', sessionId, { 
        roleTitle: data.roleTitle, 
        jobDescription: data.jobDescription.substring(0, 100) + '...',
        hasResume: !!data.resume 
      });
      // Store setup data in localStorage for demo
      localStorage.setItem(`session-${sessionId}-setup`, JSON.stringify(data));
      return { ok: true };
    },
    submitPreflight: async (sessionId: string, data: { consent: boolean; deviceInfo: { cameraOk: boolean; micOk: boolean } }) => {
      console.log('Mock: Preflight submitted for', sessionId, data);
      localStorage.setItem(`session-${sessionId}-preflight`, JSON.stringify(data));
      return { ok: true };
    },
    getRTCToken: async (sessionId: string) => {
      console.log('Mock: Getting RTC token for', sessionId);
      return {
        token: 'mock-rtc-token-' + sessionId,
        roomUrl: 'wss://mock-rtc-server.com/room/' + sessionId
      };
    },
    completeInterview: async (sessionId: string) => {
      console.log('Mock: Completing interview', sessionId);
      localStorage.setItem(`session-${sessionId}-completed`, 'true');
      return { ok: true };
    },
    getReport: async (sessionId: string) => {
      console.log('Mock: Getting report for', sessionId);
      // Simulate report generation delay
      const completed = localStorage.getItem(`session-${sessionId}-completed`);
      if (!completed) {
        return { status: 'processing' as const };
      }
      
      // Simulate random processing time
      const reportReady = Math.random() > 0.3; // 70% chance report is ready
      
      if (reportReady) {
        return {
          status: 'ready' as const,
          report: {
            overallScore: 85,
            strengths: ['Clear communication', 'Good problem-solving approach'],
            improvements: ['More specific examples needed', 'Work on technical depth'],
            detailedFeedback: 'Your interview performance was strong overall...'
          }
        };
      }
      
      return { status: 'processing' as const };
    },
  },

  analysis: {
    get: async ({ interviewId }: { interviewId: number }) => {
      return {
        id: interviewId,
        summary: 'Mock analysis summary',
      };
    },
  },

  skills: {
    detect: async ({ transcript, interviewId }: { transcript: string; interviewId: string | number }) => {
      console.log('Mock: Skills detected for interview', interviewId);
      return {
        skills: ['JavaScript', 'React', 'TypeScript'],
      };
    },
  },
  with: function(options: any) {
    return this;
  },
};

export default mockBackend;
