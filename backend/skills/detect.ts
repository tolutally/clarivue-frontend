import { api } from "encore.dev/api";
import type { SkillConfidence } from "../types/skills";

export interface DetectSkillsRequest {
  transcript: string;
  interviewId?: string;
}

export interface DetectedSkill {
  skill: string;
  confidence: SkillConfidence | "missing";
  category: string;
  evidenceTimestamp?: string;
  context?: string;
}

export interface DetectSkillsResponse {
  skills: DetectedSkill[];
  totalDetected: number;
  processingTime: number;
}

const SKILL_PATTERNS = {
  Languages: {
    Python: [/\bpython\b/gi, /\bpandas\b/gi, /\bnumpy\b/gi, /\bdjango\b/gi, /\bflask\b/gi],
    JavaScript: [/\bjavascript\b/gi, /\bjs\b/gi, /\bnode\.?js\b/gi, /\breact\b/gi, /\bvue\b/gi, /\bangular\b/gi],
    TypeScript: [/\btypescript\b/gi, /\bts\b/gi],
    Java: [/\bjava\b/gi, /\bspring\b/gi],
    SQL: [/\bsql\b/gi, /\bpostgres\b/gi, /\bmysql\b/gi, /\bquery\b/gi, /\bselect\b.*\bfrom\b/gi],
    R: [/\br\b\s+(programming|language|package)/gi, /\bggplot2\b/gi, /\bdplyr\b/gi],
    Go: [/\bgolang\b/gi, /\bgo\b\s+(language|programming)/gi],
    Rust: [/\brust\b/gi],
    C: [/\bc\+\+\b/gi, /\bc\b\s+(programming|language)/gi],
  },
  Tools: {
    Git: [/\bgit\b/gi, /\bgithub\b/gi, /\bgitlab\b/gi, /\bversion control\b/gi, /\bpull request\b/gi, /\bmerge\b/gi],
    Docker: [/\bdocker\b/gi, /\bcontainer\b/gi, /\bkubernetes\b/gi, /\bk8s\b/gi],
    Tableau: [/\btableau\b/gi],
    "Power BI": [/\bpower\s?bi\b/gi],
    Excel: [/\bexcel\b/gi, /\bspreadsheet\b/gi, /\bvlookup\b/gi, /\bpivot table\b/gi],
    Jira: [/\bjira\b/gi],
    AWS: [/\baws\b/gi, /\bamazon web services\b/gi, /\bs3\b/gi, /\bec2\b/gi, /\blambda\b/gi],
    Azure: [/\bazure\b/gi],
    GCP: [/\bgcp\b/gi, /\bgoogle cloud\b/gi],
    Figma: [/\bfigma\b/gi],
    Photoshop: [/\bphotoshop\b/gi],
  },
  Methods: {
    "Machine Learning": [/\bmachine learning\b/gi, /\bml\b/gi, /\bneural network\b/gi, /\bdeep learning\b/gi],
    "A/B Testing": [/\ba\/b test/gi, /\bexperiment/gi, /\bcontrol group\b/gi],
    Agile: [/\bagile\b/gi, /\bscrum\b/gi, /\bsprint\b/gi, /\bkanban\b/gi],
    "Data Analysis": [/\bdata analysis\b/gi, /\banalytics\b/gi, /\bstatistical\b/gi],
    "API Design": [/\bapi\b/gi, /\brest\b/gi, /\bgraphql\b/gi, /\bendpoint\b/gi],
    Testing: [/\bunit test\b/gi, /\bintegration test\b/gi, /\btdd\b/gi, /\btest driven\b/gi],
    "System Design": [/\bsystem design\b/gi, /\barchitecture\b/gi, /\bscalability\b/gi, /\bmicroservices\b/gi],
    "Data Visualization": [/\bvisualization\b/gi, /\bchart\b/gi, /\bdashboard\b/gi],
  },
  Frameworks: {
    React: [/\breact\b/gi, /\breact\.js\b/gi, /\bjsx\b/gi],
    "Node.js": [/\bnode\.?js\b/gi, /\bexpress\b/gi],
    Django: [/\bdjango\b/gi],
    Flask: [/\bflask\b/gi],
    "Spring Boot": [/\bspring boot\b/gi, /\bspring\b/gi],
    Angular: [/\bangular\b/gi],
    Vue: [/\bvue\b/gi],
  }
};

function extractTimestamp(text: string, matchIndex: number): string {
  const timestampPatterns = [
    /(\d{1,2}:\d{2}(?::\d{2})?)/g,
    /at\s+(\d{1,2}:\d{2})/gi,
    /around\s+(\d{1,2}:\d{2})/gi,
  ];

  const contextWindow = 200;
  const startIndex = Math.max(0, matchIndex - contextWindow);
  const endIndex = Math.min(text.length, matchIndex + contextWindow);
  const context = text.substring(startIndex, endIndex);

  for (const pattern of timestampPatterns) {
    const matches = Array.from(context.matchAll(pattern));
    if (matches.length > 0) {
      return matches[matches.length - 1][1];
    }
  }

  return "";
}

function getContext(text: string, matchIndex: number, matchLength: number): string {
  const contextSize = 80;
  const start = Math.max(0, matchIndex - contextSize);
  const end = Math.min(text.length, matchIndex + matchLength + contextSize);
  const context = text.substring(start, end).trim();
  return context.length > 150 ? context.substring(0, 147) + "..." : context;
}

export const detect = api<DetectSkillsRequest, DetectSkillsResponse>(
  { expose: true, method: "POST", path: "/skills/detect" },
  async (req): Promise<DetectSkillsResponse> => {
    const startTime = Date.now();
    const transcript = req.transcript.toLowerCase();
    const detectedSkills: DetectedSkill[] = [];
    const skillCounts = new Map<string, { count: number; positions: number[]; category: string }>();

    for (const [category, skills] of Object.entries(SKILL_PATTERNS)) {
      for (const [skillName, patterns] of Object.entries(skills)) {
        let matchCount = 0;
        const positions: number[] = [];

        for (const pattern of patterns) {
          const matches = Array.from(req.transcript.matchAll(pattern));
          matchCount += matches.length;
          positions.push(...matches.map(m => m.index || 0));
        }

        if (matchCount > 0) {
          skillCounts.set(skillName, {
            count: matchCount,
            positions,
            category
          });
        }
      }
    }

    for (const [skillName, data] of skillCounts.entries()) {
      let confidence: "high" | "mentioned" | "missing";
      if (data.count >= 3) {
        confidence = "high";
      } else if (data.count >= 1) {
        confidence = "mentioned";
      } else {
        confidence = "missing";
      }

      const firstPosition = data.positions[0];
      const timestamp = extractTimestamp(req.transcript, firstPosition);
      const context = getContext(req.transcript, firstPosition, skillName.length);

      detectedSkills.push({
        skill: skillName,
        confidence,
        category: data.category,
        evidenceTimestamp: timestamp,
        context
      });
    }

    detectedSkills.sort((a, b) => {
      const confidenceOrder: Record<string, number> = { high: 0, mentioned: 1, low: 2, missing: 3 };
      const aOrder = confidenceOrder[a.confidence] ?? 4;
      const bOrder = confidenceOrder[b.confidence] ?? 4;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.skill.localeCompare(b.skill);
    });

    const processingTime = Date.now() - startTime;

    return {
      skills: detectedSkills,
      totalDetected: detectedSkills.filter(s => s.confidence !== "missing").length,
      processingTime
    };
  }
);
