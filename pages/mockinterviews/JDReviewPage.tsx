import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { JDMetricsCard } from '@/components/mockinterviews/JDMetricsCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Edit3, Code, Users, Target, Briefcase, Loader2, Plus } from 'lucide-react';
import backend from '@/lib/api-client';
import type { JDMetric } from '@/lib/backend-types';

export function JDReviewPage() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const jdId = searchParams.get('jdId');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [metrics, setMetrics] = useState<JDMetric[]>([]);
  
  const [editMode, setEditMode] = useState(false);
  const [addingSkill, setAddingSkill] = useState<'technical' | 'soft' | null>(null);
  const [newSkillValue, setNewSkillValue] = useState('');

  useEffect(() => {
    if (!jdId) {
      setError('No job description ID provided');
      setLoading(false);
      return;
    }

    loadMetrics();
  }, [jdId]);

  const loadMetrics = async () => {
    try {
      const response = await backend.mockinterviews.getJDMetrics({ jdId: parseInt(jdId!) });
      if (response.success) {
        setJobTitle(response.jobTitle || 'Untitled Position');
        setCompanyName(response.companyName || '');
        setMetrics(response.metrics || []);
      } else {
        setError(response.message || 'Failed to load job description');
      }
    } catch (err) {
      setError('An error occurred while loading the job description');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillValue.trim() || !addingSkill) return;

    const skillType = addingSkill === 'technical' ? 'technical_skill' : 'soft_skill';
    
    try {
      await backend.mockinterviews.updateJDMetrics({
        jdId: parseInt(jdId!),
        additions: [{ type: skillType, value: newSkillValue.trim() }]
      });

      const newMetric: JDMetric = {
        id: Date.now().toString(),
        type: skillType,
        name: newSkillValue.trim(),
        value: newSkillValue.trim(),
        confidence: 1.0,
        isStudentAdded: true
      };
      
      setMetrics([...metrics, newMetric]);
      setNewSkillValue('');
      setAddingSkill(null);
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  const handleContinue = async () => {
    setSaving(true);
    navigate(`/mockinterviews/ready/${token}?jdId=${jdId}`);
  };

  const technicalSkills = metrics
    .filter(m => m.type === 'technical_skill')
    .map(m => ({ value: m.value, isStudentAdded: m.isStudentAdded, id: m.id }));

  const softSkills = metrics
    .filter(m => m.type === 'soft_skill')
    .map(m => ({ value: m.value, isStudentAdded: m.isStudentAdded, id: m.id }));

  const competencies = metrics
    .filter(m => m.type === 'competency')
    .map(m => {
      try {
        const parsed = JSON.parse(m.value);
        return { name: parsed.name, importance: parsed.importance };
      } catch {
        return { name: m.value, importance: m.confidence * 100 };
      }
    })
    .sort((a, b) => b.importance - a.importance);

  const experienceLevel = metrics.find(m => m.type === 'experience_level')?.value;

  const responsibilities = metrics
    .filter(m => m.type === 'responsibility')
    .map(m => m.value);

  if (loading) {
    return (
      <OnboardingLayout currentStep={5} totalSteps={6}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="inline-block animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" aria-hidden="true" />
            <p className="text-slate-600 dark:text-slate-400">Loading job description...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  if (error) {
    return (
      <OnboardingLayout currentStep={5} totalSteps={6}>
        <Card className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate(`/mockinterviews/jd-intake/${token}`)} variant="outline">
            Go Back
          </Button>
        </Card>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Review Extracted Metrics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            We've analyzed the job description and extracted key skills and competencies. You can add more, but cannot remove what was extracted.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {jobTitle}
                </h2>
              </div>
              {companyName && (
                <p className="text-slate-600 dark:text-slate-400">{companyName}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              {editMode ? 'Done Editing' : 'Add Skills'}
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <div>
            <JDMetricsCard
              title="Technical Skills"
              icon={<Code className="w-5 h-5" />}
              items={technicalSkills}
              allowAdd={editMode}
              onAdd={() => setAddingSkill('technical')}
              emptyMessage="No technical skills detected. Click 'Add more' to add skills."
            />
            {addingSkill === 'technical' && (
              <Card className="mt-2 p-4 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter technical skill (e.g., Python, React, AWS)"
                    value={newSkillValue}
                    onChange={(e) => setNewSkillValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill();
                      } else if (e.key === 'Escape') {
                        setAddingSkill(null);
                        setNewSkillValue('');
                      }
                    }}
                    autoFocus
                    aria-label="New technical skill"
                  />
                  <Button onClick={handleAddSkill} size="sm" disabled={!newSkillValue.trim()}>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Add skill</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      setAddingSkill(null);
                      setNewSkillValue('');
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <JDMetricsCard
              title="Soft Skills"
              icon={<Users className="w-5 h-5" />}
              items={softSkills}
              allowAdd={editMode}
              onAdd={() => setAddingSkill('soft')}
              emptyMessage="No soft skills detected. Click 'Add more' to add skills."
            />
            {addingSkill === 'soft' && (
              <Card className="mt-2 p-4 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter soft skill (e.g., Communication, Leadership)"
                    value={newSkillValue}
                    onChange={(e) => setNewSkillValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill();
                      } else if (e.key === 'Escape') {
                        setAddingSkill(null);
                        setNewSkillValue('');
                      }
                    }}
                    autoFocus
                    aria-label="New soft skill"
                  />
                  <Button onClick={handleAddSkill} size="sm" disabled={!newSkillValue.trim()}>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Add skill</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      setAddingSkill(null);
                      setNewSkillValue('');
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {competencies.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Key Competencies
              </h3>
              <div className="space-y-3">
                {competencies.map((comp, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {comp.name}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {comp.importance}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                        role="progressbar"
                        aria-valuenow={comp.importance}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${comp.name} importance`}
                        data-width={comp.importance}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {experienceLevel && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Experience Level
              </h3>
              <p className="text-lg text-slate-700 dark:text-slate-300">{experienceLevel}</p>
            </Card>
          )}

          {responsibilities.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/mockinterviews/jd-intake/${token}`)}
          >
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={saving}
            className="gap-2"
            size="lg"
          >
            {saving ? 'Processing...' : 'Looks Good'}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
