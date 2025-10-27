export interface SentimentScores {
  confidence: number;
  enthusiasm: number;
  professionalism: number;
  clarity: number;
}

export interface ContextSnippet {
  timestamp?: string;
  context?: string;
}

export type SkillContextSnippets = ContextSnippet[] | null;

export interface TranscriptData {
  transcript?: string;
  [key: string]: unknown;
}

export interface TranscriptSegment {
  text?: string;
  content?: string;
  [key: string]: unknown;
}
