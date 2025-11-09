// TypeScript types for the backend API
// This ensures both mock and real backends have the same interface

export interface AdminInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  email: string;
  institution?: string;
  cohortName?: string;
}

export interface SampleJD {
  id: string;
  title: string;
  company: string;
  description: string;
  jobTitle: string;
  category: string;
  companyType?: string;
  experienceLevel?: string;
  content: string;
}

export interface JDMetric {
  id: string;
  type: string;
  name: string;
  value: string;
  confidence: number;
  isStudentAdded: boolean;
}

export interface BackendClient {
  auth: {
    login: (params: { email: string; password: string }) => Promise<{
      token: string;
      admin: AdminInfo;
    }>;
    verifyMagicLink: (params: { token: string }) => Promise<{
      token: string;
      admin: AdminInfo;
    }>;
    requestMagicLink: (params: { email: string }) => Promise<{ success: boolean; message?: string }>;
    me: () => Promise<AdminInfo>;
    verifyInvite: (params: { token: string }) => Promise<{
      valid: boolean;
      email: string;
      firstName: string;
      lastName: string;
      message?: string;
    }>;
    completeOnboarding: (data: any) => Promise<{
      token: string;
      admin: AdminInfo;
    }>;
  };
  cohorts: {
    list(): Promise<any[]>;
    get(params: { id: string }): Promise<any>;
    create(data: any): Promise<any>;
    addStudents(data: { cohortId: string; students: Array<{ email: string; name: string }> }): Promise<any>;
    sendInvites(data: { cohortId: string; studentIds: string[]; timeLimit: number; numberOfInterviews: number }): Promise<any>;
  };

  // Interview API endpoints
  interviews: {
    validateInvite(token: string): Promise<{ valid: boolean; message?: string; sessionId?: string }>;
    submitProfile(sessionId: string, data: {
      phoneNumber?: string;
      targetRole: string;
      industryFocus?: string;
      experienceLevel?: string;
      careerGoals?: string;
      biggestChallenge?: string;
    }): Promise<{ ok: boolean }>;
    submitConsent(sessionId: string, data: {
      consentGiven: boolean;
      dataProcessingConsent: boolean;
      recordingConsent: boolean;
    }): Promise<{ ok: boolean }>;
    setupSession(sessionId: string, data: { 
      roleTitle: string; 
      jobDescription: string;
      resume?: {
        fileName: string;
        fileType: string;
        fileSize: number;
        data: string;
      };
    }): Promise<{ ok: boolean }>;
    submitPreflight(sessionId: string, data: { consent: boolean; deviceInfo: { cameraOk: boolean; micOk: boolean } }): Promise<{ ok: boolean }>;
    getRTCToken(sessionId: string): Promise<{ token: string; roomUrl: string }>;
    completeInterview(sessionId: string): Promise<{ ok: boolean }>;
    getReport(sessionId: string): Promise<{ status: 'processing' | 'ready'; report?: any }>;
  };

  mockinterviews: {
    verifyToken: (params: { token: string }) => Promise<{
      valid: boolean;
      currentStep: string;
      student: StudentInfo;
      message?: string;
    }>;
    submitConsent: (data: any) => Promise<{ success: boolean; message?: string }>;
    getSampleJDs: () => Promise<{ samples: SampleJD[] }>;
    parseJD: (data: any) => Promise<{ success: boolean; jdId: string; message?: string }>;
    getJDMetrics: (data: any) => Promise<{
      success: boolean;
      jobTitle: string;
      companyName: string;
      metrics: JDMetric[];
      message?: string;
    }>;
    updateJDMetrics: (data: any) => Promise<{ success: boolean; message?: string }>;
    completeProfile: (data: any) => Promise<{ success: boolean; message?: string }>;
    createInterviewSession: (data: any) => Promise<{
      success: boolean;
      sessionId: string;
      sessionUrl: string;
      message?: string;
    }>;
  };
  analysis: {
    get: (params: { interviewId: number }) => Promise<{
      id: number;
      summary: string;
    }>;
  };
  skills: {
    detect: (params: { transcript: string; interviewId: string | number }) => Promise<{
      skills: string[];
    }>;
  };
  with: (options: any) => BackendClient;
}
