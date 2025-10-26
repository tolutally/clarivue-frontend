# Student Onboarding Flow - Mock Interview Platform

## User Journey Overview

```
Email Invite → Welcome → Complete Profile → Consent → JD Intake → JD Review → Interview Ready
```

## Detailed Flow

### 1. **Welcome Page** (`/mockinterviews/welcome/:token`)
**Purpose:** Student lands here from email invite link

**UI Elements:**
- Clarivue logo and branding
- Welcome message with student's name (from token)
- Brief explanation of what to expect
- "Get Started" CTA button
- Progress indicator (Step 1 of 6)

**Backend:**
- Verify invite token
- Fetch student basic info (name, email, institution, cohort)
- Return student status (new/returning)

**Error Cases:**
- Invalid/expired token → Show error, offer to request new invite
- Already completed onboarding → Redirect to dashboard

---

### 2. **Complete Profile Page** (`/mockinterviews/profile/:token`)
**Purpose:** Collect additional student information

**UI Elements:**
- Pre-filled: Name, Email, Institution, Cohort (read-only)
- Phone Number (optional, with country code selector)
- Career Pursuit section:
  - Target role/position (text input)
  - Industry preference (dropdown)
  - Expected graduation date (date picker)
  - Current skill level (beginner/intermediate/advanced)
- "Continue" button
- Progress indicator (Step 2 of 6)

**Backend:**
- Update student profile with additional details
- Validate phone number format
- Store career pursuit data

**Error Cases:**
- Network error → Show retry option with auto-save draft
- Invalid data format → Inline validation errors

**Accessibility:**
- Clear labels for all fields
- Error messages announced to screen readers
- Keyboard navigation support

---

### 3. **Consent Page** (`/mockinterviews/consent/:token`)
**Purpose:** Obtain explicit consent for recording and data usage

**UI Elements:**
- Clear heading: "Privacy & Data Consent"
- Consent sections (each with checkbox):
  1. **What is recorded:**
     - Video and audio of interview
     - Screen activity during technical portions
     - Response transcripts and analysis
  2. **Who sees your data:**
     - Your assigned advisor
     - Clarivue AI for analysis
     - Institutional administrators (anonymized metrics only)
  3. **Data retention:**
     - Interview recordings: 90 days
     - Analysis and feedback: Duration of program + 1 year
     - Anonymized metrics: Indefinite for research
- Required checkbox: "I have read and agree to the above"
- Optional checkbox: "I consent to anonymized data being used for research"
- "Continue" button (disabled until required consent given)
- Progress indicator (Step 3 of 6)

**Backend:**
- Log consent with timestamp and IP address
- Store consent choices in database
- Generate consent record ID

**Error Cases:**
- Must agree to required consent to proceed
- Network error → Show offline indicator

**Accessibility:**
- ARIA labels for checkboxes
- Clear focus indicators
- High contrast text

---

### 4. **Job Description Intake Page** (`/mockinterviews/jd-intake/:token`)
**Purpose:** Collect job description for interview preparation

**UI Elements:**
- Three intake methods (tabs):
  
  **Tab 1: Paste Job Description**
  - Large textarea (min 100 chars)
  - Character counter
  - "Analyze JD" button
  
  **Tab 2: Paste Job URL**
  - URL input field
  - URL validation indicator
  - "Fetch & Analyze" button
  
  **Tab 3: Choose Sample JD**
  - Searchable dropdown/grid of sample JDs
  - Categories: Software Engineering, Data Science, Product Management, etc.
  - Preview on hover
  - "Use This JD" button

- Real-time validation feedback
- Progress indicator (Step 4 of 6)

**Backend:**
- Parse pasted JD text (extract key sections)
- Fetch JD from URL (web scraping with fallback)
- Retrieve sample JDs from database
- Extract JD metrics:
  - Required skills
  - Preferred qualifications
  - Technical competencies
  - Soft skills
  - Experience level
  - Key responsibilities

**Error Cases:**
- **Bad JD (too short):** "Job description must be at least 100 characters. Please provide more detail."
- **Bad JD (no skills detected):** "We couldn't identify any skills in this job description. Please check the content."
- **Invalid URL:** "Unable to access this URL. Please check the link or paste the job description directly."
- **Blocked URL (paywall/auth):** "This job posting requires authentication. Please copy and paste the text instead."
- **Network timeout:** Show retry with "Try again" or "Use different method"

**Accessibility:**
- Tab navigation between intake methods
- Screen reader announces validation errors
- Loading states clearly indicated

---

### 5. **JD Review & Metrics Page** (`/mockinterviews/jd-review/:token`)
**Purpose:** Display extracted metrics and allow student to add (not delete) skills

**UI Elements:**
- Job title (editable)
- Company name (if available, editable)
- Extracted metrics organized by category:
  
  **Technical Skills** (pills/tags)
  - e.g., Python, React, AWS, SQL
  
  **Soft Skills** (pills/tags)
  - e.g., Communication, Leadership, Problem-solving
  
  **Competencies** (progress bars)
  - e.g., System Design (70%), Data Structures (85%)
  
  **Experience Level**
  - e.g., Entry-level, Mid-level, Senior

- For each category:
  - "+ Add more" button (opens input to add additional items)
  - Cannot delete extracted items (greyed out delete icon with tooltip)
  - Added items are highlighted differently

- Edit mode toggle
- "Looks Good" / "Confirm & Continue" button
- "Back" button to re-enter JD
- Progress indicator (Step 5 of 6)

**Backend:**
- Store JD extraction results
- Save student additions
- Validate added skills against skill taxonomy
- Calculate interview difficulty based on metrics

**Error Cases:**
- Invalid skill addition → "This skill wasn't recognized. Add anyway?"
- Network error saving edits → Auto-save with retry

**Accessibility:**
- Clear focus on editable elements
- Keyboard shortcuts for adding skills (Ctrl+Enter)
- Screen reader announces added items

---

### 6. **Interview Ready Page** (`/mockinterviews/ready/:token`)
**Purpose:** Final step before starting mock interview

**UI Elements:**
- Success message: "You're all set!"
- Summary card showing:
  - Target role
  - Number of skills to be tested
  - Estimated interview duration (e.g., 30-45 min)
- Pre-interview checklist:
  - [ ] Quiet environment
  - [ ] Good lighting
  - [ ] Stable internet connection
  - [ ] Microphone permission granted
  - [ ] Camera permission granted (with test buttons)
- Device permissions test section:
  - "Test Microphone" button → shows audio wave visualization
  - "Test Camera" button → shows live video preview
  - Permission status indicators (✓ or ✗)
- Large "Start Mock Interview" button
- "Save for Later" option (generates resume link)

**Backend:**
- Create interview session
- Log device permissions status
- Generate interview questions based on JD metrics
- Set up recording infrastructure

**Error Cases:**
- **Mic blocked:** "Microphone access denied. Please enable it in browser settings." (with instructions)
- **Camera blocked:** "Camera access denied. You can continue with audio only, or enable camera in settings."
- **Both blocked:** "We need microphone access to conduct the interview. Please enable it to continue."
- **No internet:** "Weak connection detected. We recommend a stable connection for the best experience."

**Accessibility:**
- High contrast permission indicators
- Clear error messaging
- Alternative text for device test visuals
- Option to proceed with audio-only

---

## Mobile-First Design Principles

- **Touch-friendly targets:** Minimum 44px tap areas
- **Single-column layouts:** Stack elements vertically on mobile
- **Responsive typography:** Fluid font sizes (16px minimum)
- **Bottom-anchored CTAs:** Primary buttons stick to bottom on mobile
- **Collapsible sections:** Accordions for long content (like consent details)
- **Swipe gestures:** Support swipe between steps on touch devices

---

## Routing Structure

```
/mockinterviews/welcome/:token
/mockinterviews/profile/:token
/mockinterviews/consent/:token
/mockinterviews/jd-intake/:token
/mockinterviews/jd-review/:token
/mockinterviews/ready/:token
/mockinterviews/session/:interviewId (actual interview)
```

---

## Database Schema Additions

### `student_consents` table
- id (PK)
- student_id (FK)
- consented_at (timestamp)
- recording_consent (boolean)
- data_usage_consent (boolean)
- research_consent (boolean)
- ip_address (text)
- user_agent (text)

### `job_descriptions` table
- id (PK)
- student_id (FK)
- interview_id (FK, nullable)
- source_type (enum: 'pasted', 'url', 'sample')
- source_url (text, nullable)
- raw_content (text)
- job_title (text)
- company_name (text, nullable)
- created_at (timestamp)

### `jd_extracted_metrics` table
- id (PK)
- job_description_id (FK)
- metric_type (enum: 'technical_skill', 'soft_skill', 'competency', 'experience_level')
- metric_value (text)
- confidence_score (float)
- is_student_added (boolean)
- created_at (timestamp)

### `sample_job_descriptions` table
- id (PK)
- category (text)
- job_title (text)
- company_type (text)
- experience_level (text)
- content (text)
- is_active (boolean)
- created_at (timestamp)

### `onboarding_tokens` table
- id (PK)
- student_id (FK)
- token (unique text)
- expires_at (timestamp)
- used_at (timestamp, nullable)
- created_at (timestamp)

---

## API Endpoints

### `POST /mockinterviews/verify-token`
**Request:** `{ token: string }`
**Response:** `{ valid: boolean, student: StudentInfo, step: string }`

### `POST /mockinterviews/complete-profile`
**Request:** `{ token: string, phone?: string, careerPursuit: {...} }`
**Response:** `{ success: boolean }`

### `POST /mockinterviews/submit-consent`
**Request:** `{ token: string, consents: {...} }`
**Response:** `{ consentId: string }`

### `POST /mockinterviews/parse-jd`
**Request:** `{ token: string, content: string, sourceType: 'pasted' | 'url' }`
**Response:** `{ jdId: string, metrics: ExtractedMetrics }`

### `GET /mockinterviews/sample-jds`
**Response:** `{ samples: SampleJD[] }`

### `POST /mockinterviews/update-jd-metrics`
**Request:** `{ jdId: string, additions: string[] }`
**Response:** `{ success: boolean }`

### `POST /mockinterviews/create-interview-session`
**Request:** `{ token: string, jdId: string, devicePermissions: {...} }`
**Response:** `{ interviewId: string, sessionUrl: string }`

---

## Tech Stack

**Frontend:**
- React with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui components
- Zod for validation

**Backend:**
- Encore.ts services
- PostgreSQL database
- OpenAI API for JD parsing
- Cheerio/Puppeteer for URL scraping

