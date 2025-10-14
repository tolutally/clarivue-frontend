import { api, APIError } from "encore.dev/api";
import log from "encore.dev/log";
import db from "../db";
import { skills } from "~encore/clients";

interface ProcessAnalysisRequest {
  interviewId: number;
}

interface ProcessAnalysisResponse {
  success: boolean;
  analysisId: number;
  message: string;
}

async function fetchTranscript(transcriptUrl: string): Promise<string> {
  try {
    const response = await fetch(transcriptUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch transcript: ${response.statusText}`);
    }
    const data: any = await response.json();
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data && data.transcript) {
      return typeof data.transcript === 'string' 
        ? data.transcript 
        : JSON.stringify(data.transcript);
    }
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map((segment: any) => segment.text || segment.content || '').join('\n');
    }
    
    return JSON.stringify(data);
  } catch (error) {
    log.error("Error fetching transcript", { url: transcriptUrl, error });
    throw new Error("Failed to fetch transcript from URL");
  }
}

interface CompetencyAnalysis {
  competencyName: string;
  score: number;
  evidence: string;
}

interface SentimentScore {
  confidence: number;
  enthusiasm: number;
  professionalism: number;
  clarity: number;
}

async function analyzeTranscriptWithAI(transcript: string): Promise<{
  competencies: CompetencyAnalysis[];
  strengths: string[];
  concerns: string[];
  aiSummary: string;
  aiRecommendations: string;
  sentimentScores: SentimentScore;
  authenticityScore: number;
}> {
  const competencies = analyzeCompetencies(transcript);
  const strengths = extractStrengths(transcript);
  const concerns = extractConcerns(transcript);
  const aiSummary = generateSummary(transcript, strengths, concerns);
  const aiRecommendations = generateRecommendations(strengths, concerns, competencies);
  const sentimentScores = analyzeSentiment(transcript);
  const authenticityScore = calculateAuthenticityScore(transcript, sentimentScores);
  
  return {
    competencies,
    strengths,
    concerns,
    aiSummary,
    aiRecommendations,
    sentimentScores,
    authenticityScore,
  };
}

function analyzeCompetencies(transcript: string): CompetencyAnalysis[] {
  const competencies: CompetencyAnalysis[] = [];
  const lower = transcript.toLowerCase();
  
  const competencyPatterns = {
    "Problem Solving": {
      keywords: ["problem", "solution", "solve", "debug", "troubleshoot", "challenge", "issue", "fix"],
      weight: 1.2
    },
    "Communication": {
      keywords: ["explain", "communicate", "present", "discuss", "collaborate", "share", "team"],
      weight: 1.0
    },
    "Technical Knowledge": {
      keywords: ["algorithm", "data structure", "design pattern", "architecture", "optimize", "performance"],
      weight: 1.3
    },
    "Leadership": {
      keywords: ["lead", "mentor", "manage", "coordinate", "organize", "delegate", "initiative"],
      weight: 1.1
    },
    "Adaptability": {
      keywords: ["learn", "adapt", "change", "flexible", "new", "different", "pivot"],
      weight: 1.0
    },
    "Critical Thinking": {
      keywords: ["analyze", "evaluate", "assess", "consider", "think", "reason", "logic"],
      weight: 1.2
    }
  };
  
  for (const [name, config] of Object.entries(competencyPatterns)) {
    let count = 0;
    let examples: string[] = [];
    
    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        count += matches.length;
        if (examples.length < 2) {
          const index = lower.indexOf(keyword);
          if (index !== -1) {
            const start = Math.max(0, index - 30);
            const end = Math.min(transcript.length, index + 50);
            examples.push(transcript.substring(start, end).trim());
          }
        }
      }
    }
    
    const rawScore = Math.min(count * config.weight, 10);
    const score = Math.max(1, Math.min(5, Math.round(rawScore / 2)));
    
    const evidence = examples.length > 0 
      ? `Mentioned ${count} times. Examples: "${examples.join('"; "')}"`
      : `Mentioned ${count} times`;
    
    competencies.push({
      competencyName: name,
      score,
      evidence
    });
  }
  
  return competencies.sort((a, b) => b.score - a.score);
}

function extractStrengths(transcript: string): string[] {
  const strengths: string[] = [];
  const lower = transcript.toLowerCase();
  
  if (lower.includes("experience") || lower.includes("worked on") || lower.includes("built")) {
    strengths.push("Demonstrates relevant hands-on experience");
  }
  
  if (lower.includes("team") || lower.includes("collaborate") || lower.includes("worked with")) {
    strengths.push("Shows strong collaboration skills");
  }
  
  const technicalTerms = ["algorithm", "api", "database", "framework", "architecture", "design pattern"];
  const techCount = technicalTerms.filter(term => lower.includes(term)).length;
  if (techCount >= 3) {
    strengths.push("Strong technical vocabulary and knowledge");
  }
  
  if (lower.includes("learn") || lower.includes("research") || lower.includes("study")) {
    strengths.push("Demonstrates continuous learning mindset");
  }
  
  if (lower.includes("challenge") || lower.includes("problem") || lower.includes("solution")) {
    strengths.push("Good problem-solving approach");
  }
  
  if (strengths.length === 0) {
    strengths.push("Participated in interview discussion");
  }
  
  return strengths.slice(0, 5);
}

function extractConcerns(transcript: string): string[] {
  const concerns: string[] = [];
  const lower = transcript.toLowerCase();
  const words = transcript.split(/\s+/).length;
  
  if (words < 100) {
    concerns.push("Limited verbal response - may need more elaboration");
  }
  
  const fillerWords = ["um", "uh", "like", "you know", "kind of", "sort of"];
  const fillerCount = fillerWords.reduce((acc, word) => {
    const matches = lower.match(new RegExp(`\\b${word}\\b`, 'g'));
    return acc + (matches ? matches.length : 0);
  }, 0);
  
  if (fillerCount > 15) {
    concerns.push("High use of filler words - may indicate nervousness or uncertainty");
  }
  
  const technicalTerms = ["algorithm", "api", "database", "framework", "architecture"];
  const techCount = technicalTerms.filter(term => lower.includes(term)).length;
  if (techCount < 2) {
    concerns.push("Limited technical terminology used");
  }
  
  if (!lower.includes("project") && !lower.includes("experience") && !lower.includes("worked")) {
    concerns.push("Limited discussion of practical experience");
  }
  
  if (concerns.length === 0) {
    concerns.push("No major concerns identified");
  }
  
  return concerns.slice(0, 5);
}

function generateSummary(transcript: string, strengths: string[], concerns: string[]): string {
  const words = transcript.split(/\s+/).length;
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  const parts = [];
  
  if (words > 500) {
    parts.push("The candidate provided detailed responses throughout the interview.");
  } else if (words > 200) {
    parts.push("The candidate provided moderate responses to interview questions.");
  } else {
    parts.push("The candidate provided brief responses to interview questions.");
  }
  
  if (strengths.length > 3) {
    parts.push(`Key strengths include ${strengths.slice(0, 2).join(" and ").toLowerCase()}.`);
  } else if (strengths.length > 0) {
    parts.push(`Primary strength: ${strengths[0].toLowerCase()}.`);
  }
  
  if (concerns.length > 0 && !concerns[0].toLowerCase().includes("no major concerns")) {
    parts.push(`Areas for development: ${concerns[0].toLowerCase()}.`);
  }
  
  return parts.join(" ");
}

function generateRecommendations(
  strengths: string[], 
  concerns: string[], 
  competencies: CompetencyAnalysis[]
): string {
  const recommendations: string[] = [];
  
  const lowScoreCompetencies = competencies.filter(c => c.score <= 2);
  if (lowScoreCompetencies.length > 0) {
    const names = lowScoreCompetencies.map(c => c.competencyName).join(", ");
    recommendations.push(`Focus on developing: ${names}.`);
  }
  
  if (concerns.some(c => c.toLowerCase().includes("technical"))) {
    recommendations.push("Recommend technical skill workshops or courses.");
  }
  
  if (concerns.some(c => c.toLowerCase().includes("experience"))) {
    recommendations.push("Encourage participation in hands-on projects or internships.");
  }
  
  if (concerns.some(c => c.toLowerCase().includes("filler words") || c.toLowerCase().includes("nervousness"))) {
    recommendations.push("Consider mock interview practice to build confidence.");
  }
  
  const highScoreCompetencies = competencies.filter(c => c.score >= 4);
  if (highScoreCompetencies.length > 0) {
    recommendations.push(`Leverage strengths in ${highScoreCompetencies[0].competencyName.toLowerCase()} for advanced opportunities.`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Continue building on current skill set with diverse project experience.");
  }
  
  return recommendations.join(" ");
}

function analyzeSentiment(transcript: string): SentimentScore {
  const lower = transcript.toLowerCase();
  
  const positiveWords = ["excited", "love", "great", "amazing", "excellent", "enjoy", "passionate", "interested"];
  const negativeWords = ["difficult", "struggle", "hard", "confusing", "unsure", "don't know", "never"];
  
  const positiveCount = positiveWords.reduce((acc, word) => 
    acc + (lower.match(new RegExp(`\\b${word}\\w*\\b`, 'g'))?.length || 0), 0);
  const negativeCount = negativeWords.reduce((acc, word) => 
    acc + (lower.match(new RegExp(`\\b${word}\\w*\\b`, 'g'))?.length || 0), 0);
  
  const confidence = Math.min(100, Math.max(0, 50 + (positiveCount * 5) - (negativeCount * 5)));
  
  const enthusiasmWords = ["excited", "love", "passionate", "really", "definitely"];
  const enthusiasmCount = enthusiasmWords.reduce((acc, word) => 
    acc + (lower.match(new RegExp(`\\b${word}\\w*\\b`, 'g'))?.length || 0), 0);
  const enthusiasm = Math.min(100, Math.max(0, 40 + (enthusiasmCount * 10)));
  
  const professionalWords = ["experience", "project", "team", "responsibility", "deliver"];
  const professionalCount = professionalWords.reduce((acc, word) => 
    acc + (lower.match(new RegExp(`\\b${word}\\w*\\b`, 'g'))?.length || 0), 0);
  const professionalism = Math.min(100, Math.max(0, 40 + (professionalCount * 8)));
  
  const words = transcript.split(/\s+/).length;
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  const clarity = Math.min(100, Math.max(0, avgWordsPerSentence > 10 && avgWordsPerSentence < 25 ? 70 : 50));
  
  return {
    confidence,
    enthusiasm,
    professionalism,
    clarity
  };
}

function calculateAuthenticityScore(transcript: string, sentiment: SentimentScore): number {
  const lower = transcript.toLowerCase();
  
  const personalPronouns = lower.match(/\b(i|my|me|mine)\b/g)?.length || 0;
  const words = transcript.split(/\s+/).length;
  const personalPronounRatio = words > 0 ? (personalPronouns / words) * 100 : 0;
  
  const specificExamples = lower.match(/\b(for example|such as|like when|specifically)\b/g)?.length || 0;
  
  let score = 50;
  
  if (personalPronounRatio > 5 && personalPronounRatio < 20) {
    score += 20;
  } else if (personalPronounRatio >= 2) {
    score += 10;
  }
  
  score += Math.min(20, specificExamples * 5);
  
  score += (sentiment.confidence - 50) * 0.2;
  
  return Math.min(100, Math.max(0, score));
}

function calculateReadinessScore(
  competencies: CompetencyAnalysis[],
  skillsCount: number,
  authenticityScore: number,
  sentimentScores: SentimentScore
): number {
  const avgCompetencyScore = competencies.length > 0
    ? competencies.reduce((sum, c) => sum + c.score, 0) / competencies.length
    : 0;
  
  const competencyWeight = 0.35;
  const skillsWeight = 0.25;
  const authenticityWeight = 0.20;
  const sentimentWeight = 0.20;
  
  const normalizedCompetency = (avgCompetencyScore / 5) * 100;
  
  const normalizedSkills = Math.min(100, (skillsCount / 10) * 100);
  
  const avgSentiment = (
    sentimentScores.confidence * 0.3 +
    sentimentScores.enthusiasm * 0.2 +
    sentimentScores.professionalism * 0.3 +
    sentimentScores.clarity * 0.2
  );
  
  const readinessScore = (
    normalizedCompetency * competencyWeight +
    normalizedSkills * skillsWeight +
    authenticityScore * authenticityWeight +
    avgSentiment * sentimentWeight
  );
  
  return Math.round(Math.min(100, Math.max(0, readinessScore)));
}

function calculateTechnicalDepthIndex(
  transcript: string,
  competencies: CompetencyAnalysis[],
  skillsCount: number
): number {
  const technicalCompetency = competencies.find(c => c.competencyName === "Technical Knowledge");
  const techScore = technicalCompetency ? (technicalCompetency.score / 5) * 40 : 0;
  
  const skillsScore = Math.min(30, (skillsCount / 15) * 30);
  
  const technicalTerms = [
    "algorithm", "complexity", "optimization", "scalability", "architecture",
    "design pattern", "data structure", "api", "database", "framework",
    "deployment", "testing", "debugging", "performance", "security"
  ];
  
  const lower = transcript.toLowerCase();
  const techTermCount = technicalTerms.filter(term => lower.includes(term)).length;
  const techTermScore = Math.min(30, (techTermCount / 10) * 30);
  
  return Math.round(techScore + skillsScore + techTermScore);
}

export const process = api<ProcessAnalysisRequest, ProcessAnalysisResponse>(
  { expose: true, method: "POST", path: "/analysis/process/:interviewId" },
  async (req) => {
    log.info("Starting interview analysis", { interview_id: req.interviewId });
    
    const interview = await db.queryRow<any>`
      SELECT id, student_id, transcript_url, status 
      FROM interviews 
      WHERE id = ${req.interviewId}
    `;

    if (!interview) {
      throw APIError.notFound("interview not found");
    }

    if (!interview.transcript_url) {
      throw APIError.failedPrecondition("interview does not have a transcript yet");
    }
    
    const existingAnalysis = await db.queryRow<{ id: bigint }>`
      SELECT id FROM interview_analysis WHERE interview_id = ${req.interviewId}
    `;
    
    if (existingAnalysis) {
      log.info("Analysis already exists, re-processing", { interview_id: req.interviewId });
    }
    
    const transcript = await fetchTranscript(interview.transcript_url);
    log.info("Transcript fetched", { interview_id: req.interviewId, length: transcript.length });
    
    const skillsResponse = await skills.detect({ transcript, interviewId: String(req.interviewId) });
    log.info("Skills detected", { interview_id: req.interviewId, count: skillsResponse.totalDetected });
    
    await db.exec`DELETE FROM skills_detected WHERE interview_id = ${req.interviewId}`;
    
    for (const skill of skillsResponse.skills) {
      const confidenceScore = skill.confidence === "high" ? 0.9 : 
                             skill.confidence === "mentioned" ? 0.6 : 0.3;
      
      await db.exec`
        INSERT INTO skills_detected (
          interview_id, skill_name, category, confidence_score, 
          mentioned_count, context_snippets
        )
        VALUES (
          ${req.interviewId}, ${skill.skill}, ${skill.category}, ${confidenceScore},
          1, ${JSON.stringify({ timestamp: skill.evidenceTimestamp, context: skill.context })}
        )
      `;
    }
    
    const aiAnalysis = await analyzeTranscriptWithAI(transcript);
    log.info("AI analysis complete", { interview_id: req.interviewId });
    
    await db.exec`DELETE FROM competencies WHERE interview_id = ${req.interviewId}`;
    
    for (const comp of aiAnalysis.competencies) {
      await db.exec`
        INSERT INTO competencies (interview_id, competency_name, score, evidence)
        VALUES (${req.interviewId}, ${comp.competencyName}, ${comp.score}, ${comp.evidence})
      `;
    }
    
    const readinessScore = calculateReadinessScore(
      aiAnalysis.competencies,
      skillsResponse.totalDetected,
      aiAnalysis.authenticityScore,
      aiAnalysis.sentimentScores
    );
    
    const technicalDepthIndex = calculateTechnicalDepthIndex(
      transcript,
      aiAnalysis.competencies,
      skillsResponse.totalDetected
    );
    
    const analysisResult = await db.queryRow<{ id: bigint }>`
      INSERT INTO interview_analysis (
        interview_id, overall_readiness_score, technical_depth_index,
        authenticity_score, strengths, concerns, ai_summary,
        ai_recommendations, sentiment_scores, processed_at
      )
      VALUES (
        ${req.interviewId}, ${readinessScore}, ${technicalDepthIndex},
        ${aiAnalysis.authenticityScore}, ${aiAnalysis.strengths}, ${aiAnalysis.concerns},
        ${aiAnalysis.aiSummary}, ${aiAnalysis.aiRecommendations},
        ${JSON.stringify(aiAnalysis.sentimentScores)}, NOW()
      )
      ON CONFLICT (interview_id) DO UPDATE
      SET overall_readiness_score = ${readinessScore},
          technical_depth_index = ${technicalDepthIndex},
          authenticity_score = ${aiAnalysis.authenticityScore},
          strengths = ${aiAnalysis.strengths},
          concerns = ${aiAnalysis.concerns},
          ai_summary = ${aiAnalysis.aiSummary},
          ai_recommendations = ${aiAnalysis.aiRecommendations},
          sentiment_scores = ${JSON.stringify(aiAnalysis.sentimentScores)},
          processed_at = NOW()
      RETURNING id
    `;
    
    const avgReadiness = aiAnalysis.competencies.reduce((sum, c) => sum + c.score, 0) / 
                        (aiAnalysis.competencies.length || 1);
    const avgTechnical = technicalDepthIndex / 100 * 5;
    const avgBehavioral = aiAnalysis.sentimentScores.professionalism / 100 * 5;
    
    await db.exec`
      UPDATE students
      SET readiness_score = ${readinessScore},
          technical_score = ${avgTechnical},
          behavioral_score = ${avgBehavioral},
          updated_at = NOW()
      WHERE id = ${interview.student_id}
    `;
    
    log.info("Analysis complete and stored", { 
      interview_id: req.interviewId,
      analysis_id: analysisResult!.id,
      readiness_score: readinessScore
    });
    
    return {
      success: true,
      analysisId: Number(analysisResult!.id),
      message: "Interview analysis completed successfully"
    };
  }
);
