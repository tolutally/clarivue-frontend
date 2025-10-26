CREATE TABLE IF NOT EXISTS onboarding_tokens (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  current_step TEXT DEFAULT 'welcome',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_onboarding_tokens_token ON onboarding_tokens(token);
CREATE INDEX idx_onboarding_tokens_student_id ON onboarding_tokens(student_id);

CREATE TABLE IF NOT EXISTS student_consents (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recording_consent BOOLEAN NOT NULL DEFAULT false,
  data_usage_consent BOOLEAN NOT NULL DEFAULT false,
  research_consent BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_consents_student_id ON student_consents(student_id);

CREATE TYPE jd_source_type AS ENUM ('pasted', 'url', 'sample');

CREATE TABLE IF NOT EXISTS job_descriptions (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  interview_id BIGINT REFERENCES interviews(id) ON DELETE SET NULL,
  source_type jd_source_type NOT NULL,
  source_url TEXT,
  raw_content TEXT NOT NULL,
  job_title TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_descriptions_student_id ON job_descriptions(student_id);
CREATE INDEX idx_job_descriptions_interview_id ON job_descriptions(interview_id);

CREATE TYPE metric_type AS ENUM ('technical_skill', 'soft_skill', 'competency', 'experience_level', 'responsibility');

CREATE TABLE IF NOT EXISTS jd_extracted_metrics (
  id BIGSERIAL PRIMARY KEY,
  job_description_id BIGINT NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  metric_type metric_type NOT NULL,
  metric_value TEXT NOT NULL,
  confidence_score FLOAT DEFAULT 0.0,
  is_student_added BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jd_metrics_job_description_id ON jd_extracted_metrics(job_description_id);
CREATE INDEX idx_jd_metrics_type ON jd_extracted_metrics(metric_type);

CREATE TABLE IF NOT EXISTS sample_job_descriptions (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_type TEXT,
  experience_level TEXT,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sample_jds_category ON sample_job_descriptions(category);
CREATE INDEX idx_sample_jds_active ON sample_job_descriptions(is_active);

ALTER TABLE students ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS industry_preference TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS expected_graduation DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS skill_level TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;
