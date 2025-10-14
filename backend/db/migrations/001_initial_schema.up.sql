CREATE TABLE advisors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  specialization TEXT,
  years_experience INTEGER,
  capacity INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cohort TEXT,
  enrollment_date TIMESTAMPTZ,
  advisor_id BIGINT REFERENCES advisors(id) ON DELETE SET NULL,
  readiness_score DOUBLE PRECISION,
  technical_score DOUBLE PRECISION,
  behavioral_score DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE interviews (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  recall_bot_id TEXT,
  recall_meeting_id TEXT,
  scheduled_at TIMESTAMPTZ,
  conducted_at TIMESTAMPTZ,
  duration INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled',
  transcript_url TEXT,
  video_url TEXT,
  raw_recall_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE interview_analysis (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
  overall_readiness_score DOUBLE PRECISION,
  technical_depth_index DOUBLE PRECISION,
  authenticity_score DOUBLE PRECISION,
  strengths TEXT[],
  concerns TEXT[],
  ai_summary TEXT,
  ai_recommendations TEXT,
  sentiment_scores JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skills_detected (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT,
  confidence_score DOUBLE PRECISION,
  mentioned_count INTEGER DEFAULT 1,
  context_snippets JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE competencies (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  competency_name TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  evidence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE advisor_notes (
  id BIGSERIAL PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  advisor_id BIGINT NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_advisor_id ON students(advisor_id);
CREATE INDEX idx_students_cohort ON students(cohort);
CREATE INDEX idx_interviews_student_id ON interviews(student_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_skills_detected_interview_id ON skills_detected(interview_id);
CREATE INDEX idx_competencies_interview_id ON competencies(interview_id);
CREATE INDEX idx_advisor_notes_interview_id ON advisor_notes(interview_id);
CREATE INDEX idx_advisor_notes_advisor_id ON advisor_notes(advisor_id);
