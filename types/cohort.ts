export type CohortTags = Record<string, string> | null;

export type StudentStatus = 'added' | 'invited' | 'in-progress' | 'completed';

export interface CohortStudent {
  id: string;
  email: string;
  name: string;
  status: StudentStatus;
  invitedAt?: Date;
  completedInterviews?: number;
  totalInterviews?: number;
  timeLimit?: number; // in minutes
}
