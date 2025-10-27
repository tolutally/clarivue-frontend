import { api } from "encore.dev/api";
import { db } from "../db";

export interface ExtractedMetric {
  type: "technical_skill" | "soft_skill" | "competency" | "experience_level" | "responsibility";
  value: string;
  confidence: number;
}

export interface ExtractedMetrics {
  technicalSkills: string[];
  softSkills: string[];
  competencies: Array<{ name: string; importance: number }>;
  experienceLevel?: string;
  responsibilities: string[];
}

export interface ParseJDRequest {
  token: string;
  content: string;
  sourceType: "pasted" | "url" | "sample";
  sourceUrl?: string;
  sampleJdId?: number;
}

export interface ParseJDResponse {
  success: boolean;
  jdId?: number;
  jobTitle?: string;
  companyName?: string;
  metrics?: ExtractedMetrics;
  message?: string;
}

function extractJobTitle(content: string): string | undefined {
  const titlePatterns = [
    /(?:position|role|title):\s*([^\n]+)/i,
    /(?:hiring|seeking|looking for)(?:\s+a(?:n)?)?\s+([^\n,]+)/i,
    /^([A-Z][^\n]{5,50}?)(?:\s*-|\s*\||\s*at)/m
  ];

  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractCompanyName(content: string): string | undefined {
  const companyPatterns = [
    /(?:company|organization):\s*([^\n]+)/i,
    /(?:at|@)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s+is|\s+we|\s*,|\s*\.|$)/m,
    /(?:join|work at)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s+as|\s+to|\s*!)/i
  ];

  for (const pattern of companyPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 2 && name.length < 50) {
        return name;
      }
    }
  }

  return undefined;
}

function extractMetrics(content: string): ExtractedMetrics {
  const lowerContent = content.toLowerCase();

  const technicalKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
    'git', 'ci/cd', 'jenkins', 'github actions',
    'html', 'css', 'sass', 'tailwind',
    'rest api', 'graphql', 'microservices',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'spark', 'hadoop',
    'agile', 'scrum', 'jira'
  ];

  const softSkillKeywords = [
    'communication', 'leadership', 'teamwork', 'collaboration', 'problem-solving',
    'critical thinking', 'analytical', 'creativity', 'adaptability', 'time management',
    'presentation', 'written communication', 'interpersonal', 'conflict resolution',
    'emotional intelligence', 'decision making', 'attention to detail'
  ];

  const technicalSkills: string[] = [];
  for (const skill of technicalKeywords) {
    if (lowerContent.includes(skill.toLowerCase())) {
      const formatted = skill.split(' ').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      if (!technicalSkills.includes(formatted)) {
        technicalSkills.push(formatted);
      }
    }
  }

  const softSkills: string[] = [];
  for (const skill of softSkillKeywords) {
    if (lowerContent.includes(skill.toLowerCase())) {
      const formatted = skill.split(' ').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      if (!softSkills.includes(formatted)) {
        softSkills.push(formatted);
      }
    }
  }

  const competencyKeywords = [
    { name: 'System Design', keywords: ['system design', 'architecture', 'scalability', 'distributed systems'] },
    { name: 'Data Structures & Algorithms', keywords: ['data structures', 'algorithms', 'complexity', 'optimization'] },
    { name: 'Database Management', keywords: ['database', 'sql', 'nosql', 'data modeling'] },
    { name: 'API Development', keywords: ['api', 'rest', 'graphql', 'endpoint'] },
    { name: 'Cloud Computing', keywords: ['cloud', 'aws', 'azure', 'gcp'] },
    { name: 'Testing & QA', keywords: ['testing', 'unit test', 'integration test', 'qa'] },
    { name: 'DevOps & CI/CD', keywords: ['devops', 'ci/cd', 'deployment', 'pipeline'] },
    { name: 'Security', keywords: ['security', 'authentication', 'authorization', 'encryption'] },
    { name: 'Data Analysis', keywords: ['data analysis', 'analytics', 'visualization', 'insights'] },
    { name: 'Product Strategy', keywords: ['product', 'roadmap', 'strategy', 'requirements'] }
  ];

  const competencies: Array<{ name: string; importance: number }> = [];
  for (const comp of competencyKeywords) {
    let matchCount = 0;
    for (const keyword of comp.keywords) {
      if (lowerContent.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      const importance = Math.min(matchCount * 25, 100);
      competencies.push({ name: comp.name, importance });
    }
  }

  let experienceLevel: string | undefined;
  if (lowerContent.includes('entry') || lowerContent.includes('junior') || lowerContent.includes('0-2 years')) {
    experienceLevel = 'Entry-level';
  } else if (lowerContent.includes('senior') || lowerContent.includes('5+ years') || lowerContent.includes('lead')) {
    experienceLevel = 'Senior';
  } else if (lowerContent.includes('mid') || lowerContent.includes('2-5 years')) {
    experienceLevel = 'Mid-level';
  }

  const responsibilityPatterns = [
    /(?:responsibilities|duties|you will):\s*\n((?:[-•*]\s*.+\n?)+)/i,
    /(?:responsibilities|duties|you will)[:\n]\s*((?:[-•*]\s*.+\n?)+)/i
  ];

  const responsibilities: string[] = [];
  for (const pattern of responsibilityPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const items = match[1]
        .split('\n')
        .filter(line => line.trim().match(/^[-•*]\s*.+/))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10);
      responsibilities.push(...items);
    }
  }

  if (responsibilities.length === 0) {
    const sentences = content.split(/[.!]\s+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('develop') || 
          sentence.toLowerCase().includes('build') ||
          sentence.toLowerCase().includes('design') ||
          sentence.toLowerCase().includes('implement')) {
        if (sentence.length > 20 && sentence.length < 200) {
          responsibilities.push(sentence.trim());
          if (responsibilities.length >= 3) break;
        }
      }
    }
  }

  return {
    technicalSkills: technicalSkills.slice(0, 15),
    softSkills: softSkills.slice(0, 10),
    competencies: competencies.sort((a, b) => b.importance - a.importance).slice(0, 8),
    experienceLevel,
    responsibilities: responsibilities.slice(0, 6)
  };
}

export const parseJD = api(
  { expose: true, method: "POST", path: "/mockinterviews/parse-jd" },
  async (req: ParseJDRequest): Promise<ParseJDResponse> => {
    if (req.content.length < 100) {
      return {
        success: false,
        message: "Job description must be at least 100 characters. Please provide more detail."
      };
    }

    if (req.token === "demo-token") {
      const metrics = extractMetrics(req.content);
      const jobTitle = extractJobTitle(req.content);
      const companyName = extractCompanyName(req.content);
      return {
        success: true,
        jdId: 999,
        jobTitle,
        companyName,
        metrics
      };
    }

    const tokenData = await db.queryRow<{ student_id: bigint }>`
      SELECT student_id 
      FROM onboarding_tokens 
      WHERE token = ${req.token} AND expires_at > NOW()
    `;

    if (!tokenData) {
      return {
        success: false,
        message: "Invalid or expired token"
      };
    }

    const studentId = tokenData.student_id;
    const metrics = extractMetrics(req.content);

    if (metrics.technicalSkills.length === 0 && metrics.softSkills.length === 0) {
      return {
        success: false,
        message: "We couldn't identify any skills in this job description. Please check the content and try again."
      };
    }

    const jobTitle = extractJobTitle(req.content);
    const companyName = extractCompanyName(req.content);

    const jdResult = await db.queryRow<{ id: bigint }>`
      INSERT INTO job_descriptions 
      (student_id, source_type, source_url, raw_content, job_title, company_name)
      VALUES (${studentId}, ${req.sourceType}, ${req.sourceUrl || null}, 
              ${req.content}, ${jobTitle || 'Untitled Position'}, ${companyName || null})
      RETURNING id
    `;

    const jdId = jdResult!.id;

    for (const skill of metrics.technicalSkills) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${jdId}, 'technical_skill', ${skill}, 0.85, false)
      `;
    }

    for (const skill of metrics.softSkills) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${jdId}, 'soft_skill', ${skill}, 0.80, false)
      `;
    }

    for (const comp of metrics.competencies) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${jdId}, 'competency', ${JSON.stringify({ name: comp.name, importance: comp.importance })}, 
                ${comp.importance / 100}, false)
      `;
    }

    if (metrics.experienceLevel) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${jdId}, 'experience_level', ${metrics.experienceLevel}, 0.75, false)
      `;
    }

    for (const resp of metrics.responsibilities) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${jdId}, 'responsibility', ${resp}, 0.70, false)
      `;
    }

    await db.exec`
      UPDATE onboarding_tokens 
      SET current_step = 'jd-review' 
      WHERE token = ${req.token}
    `;

    return {
      success: true,
      jdId: Number(jdId),
      jobTitle,
      companyName,
      metrics
    };
  }
);
