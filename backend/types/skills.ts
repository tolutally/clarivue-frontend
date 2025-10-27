export type SkillConfidence = "high" | "mentioned" | "low";

export interface DetectedSkill {
  skill: string;
  category: string;
  confidence: SkillConfidence;
  evidenceTimestamp: string;
  context: string;
}

export interface SkillDetectionSuccess {
  success: true;
  skills: DetectedSkill[];
  totalDetected: number;
}

export interface SkillDetectionFailure {
  success: false;
  error: string;
}

export type SkillDetectionResult = SkillDetectionSuccess | SkillDetectionFailure;
