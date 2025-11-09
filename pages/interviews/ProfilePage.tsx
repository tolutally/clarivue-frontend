import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, User, X, Plus, Sparkles, Target, Clock } from 'lucide-react';
import { InterviewHeader } from '../../components/interview/InterviewHeader';

/**
 * ProfilePage
 * 
 * Route: /session/:sessionId/profile
 * 
 * Purpose: Collect student profile and career preferences.
 * Adapted from legacy mockinterviews/CompleteProfilePage with new session-based routing.
 */
export function ProfilePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const backend = apiClient;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    targetRole: '',
    industryFocus: [] as string[],
    experienceLevel: '',
    careerGoals: '',
    biggestChallenge: ''
  });

  const [newIndustry, setNewIndustry] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Industry options for selection - make it state so it can be updated
  const [industryOptions, setIndustryOptions] = useState([
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Media & Entertainment', 'Energy', 'Transportation', 'Real Estate', 'Non-profit'
  ]);

  // Career goals suggestions
  const careerGoalSuggestions = [
    'Land my first tech job', 'Transition to a new role', 'Advance to senior position',
    'Build technical skills', 'Develop leadership abilities', 'Start my own company',
    'Work at a startup', 'Join a large corporation', 'Work remotely', 'Improve work-life balance'
  ];

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`profileDraft_${sessionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error('Failed to parse saved profile data');
      }
    }

    // Load custom industries from localStorage
    const savedIndustries = localStorage.getItem('customIndustries');
    if (savedIndustries) {
      try {
        const parsed = JSON.parse(savedIndustries);
        const allIndustries = [
          'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
          'Consulting', 'Media & Entertainment', 'Energy', 'Transportation', 'Real Estate', 'Non-profit',
          ...parsed
        ];
        setIndustryOptions([...new Set(allIndustries)]); // Remove duplicates
      } catch (e) {
        console.error('Failed to parse saved custom industries');
      }
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(`profileDraft_${sessionId}`, JSON.stringify(formData));
  }, [formData, sessionId]);

  const addIndustry = (industry: string) => {
    if (industry && !formData.industryFocus.includes(industry)) {
      setFormData({
        ...formData,
        industryFocus: [...formData.industryFocus, industry]
      });
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData({
      ...formData,
      industryFocus: formData.industryFocus.filter(i => i !== industry)
    });
  };

  const addCareerGoal = (goal: string) => {
    if (goal && formData.careerGoals !== goal) {
      setFormData({ ...formData, careerGoals: goal });
    }
  };

  const toggleIndustry = (industry: string) => {
    if (formData.industryFocus.includes(industry)) {
      removeIndustry(industry);
    } else {
      addIndustry(industry);
    }
  };

  const addCustomIndustry = () => {
    const trimmedIndustry = newIndustry.trim();
    
    if (!trimmedIndustry) return;
    
    // Check if industry already exists (case insensitive)
    const existsInOptions = industryOptions.some(option => 
      option.toLowerCase() === trimmedIndustry.toLowerCase()
    );
    const existsInSelected = formData.industryFocus.some(industry => 
      industry.toLowerCase() === trimmedIndustry.toLowerCase()
    );
    
    // Add to industry options if it doesn't already exist
    if (!existsInOptions) {
      setIndustryOptions(prev => {
        const newOptions = [...prev, trimmedIndustry];
        
        // Save custom industries to localStorage (excluding default ones)
        const defaultIndustries = [
          'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
          'Consulting', 'Media & Entertainment', 'Energy', 'Transportation', 'Real Estate', 'Non-profit'
        ];
        const customIndustries = newOptions.filter(industry => !defaultIndustries.includes(industry));
        localStorage.setItem('customIndustries', JSON.stringify(customIndustries));
        
        return newOptions;
      });
    }
    
    // Add to selected industries if not already selected
    if (!existsInSelected) {
      addIndustry(trimmedIndustry);
    }
    
    // Clear the input field
    setNewIndustry('');
  };

  const addCareerGoalSuggestion = (suggestion: string) => {
    const currentGoals = formData.careerGoals;
    const newGoals = currentGoals ? `${currentGoals}, ${suggestion}` : suggestion;
    setFormData({ ...formData, careerGoals: newGoals });
  };

  const generateInterviewPreview = () => {
    const { targetRole, industryFocus, experienceLevel, careerGoals, biggestChallenge } = formData;

    // If no data is filled, show default message
    if (!targetRole && !industryFocus.length && !experienceLevel && !careerGoals && !biggestChallenge) {
      return (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Fill out your profile to see how your AI interview will be personalized for your career goals.
          </p>
        </div>
      );
    }

    // Generate skill areas based on target role
    const getSkillAreas = (role: string) => {
      const roleLower = role.toLowerCase();
      if (roleLower.includes('data') || roleLower.includes('analyst')) {
        return ['SQL', 'data visualization', 'statistical analysis', 'storytelling'];
      } else if (roleLower.includes('software') || roleLower.includes('developer') || roleLower.includes('engineer')) {
        return ['coding', 'system design', 'problem-solving', 'debugging'];
      } else if (roleLower.includes('product') || roleLower.includes('manager')) {
        return ['strategy', 'stakeholder management', 'prioritization', 'user research'];
      } else if (roleLower.includes('design') || roleLower.includes('ux') || roleLower.includes('ui')) {
        return ['user experience', 'visual design', 'prototyping', 'user research'];
      } else if (roleLower.includes('marketing')) {
        return ['campaign strategy', 'analytics', 'content creation', 'customer acquisition'];
      } else if (roleLower.includes('sales')) {
        return ['relationship building', 'negotiation', 'pipeline management', 'consultative selling'];
      } else {
        return ['communication', 'problem-solving', 'leadership', 'analytical thinking'];
      }
    };

    const skillAreas = targetRole ? getSkillAreas(targetRole) : [];
    const industries = industryFocus.length > 0 ? industryFocus.join(', ') : '';

    return (
      <div className="space-y-3 text-sm">
        {targetRole && (
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Your AI interview will focus on {targetRole} skills
              </span>
              {skillAreas.length > 0 && (
                <span className="text-slate-600 dark:text-slate-400">
                  {' '}with questions in {skillAreas.slice(0, -1).join(', ')}{skillAreas.length > 1 ? ', and ' : ''}{skillAreas.slice(-1)}.
                </span>
              )}
            </div>
          </div>
        )}

        {industries && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Questions will be tailored for the <span className="font-medium text-slate-900 dark:text-slate-100">{industries}</span> {industryFocus.length > 1 ? 'industries' : 'industry'}.
            </div>
          </div>
        )}

        {experienceLevel && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Difficulty will be adjusted for <span className="font-medium text-slate-900 dark:text-slate-100">{experienceLevel.replace('-', ' ')}</span> candidates.
            </div>
          </div>
        )}

        {careerGoals && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Career development questions will explore your goals around <span className="font-medium text-slate-900 dark:text-slate-100">{careerGoals.toLowerCase()}</span>.
            </div>
          </div>
        )}

        {biggestChallenge && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Behavioral questions will address challenges like <span className="font-medium text-slate-900 dark:text-slate-100">{biggestChallenge.toLowerCase()}</span>.
            </div>
          </div>
        )}

        {(targetRole || industryFocus.length || experienceLevel) && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Interview will be approximately 20-30 minutes
            </div>
          </div>
        )}
      </div>
    );
  };

  const validateForm = () => {
    if (!formData.targetRole.trim()) {
      setError('Please enter your target role');
      return false;
    }
    if (!formData.experienceLevel) {
      setError('Please select your experience level');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!sessionId) {
      setError('Invalid session');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await backend.interviews.submitProfile(sessionId!, {
        phoneNumber: formData.phoneNumber,
        targetRole: formData.targetRole,
        industryFocus: formData.industryFocus.join(', '),
        experienceLevel: formData.experienceLevel,
        careerGoals: formData.careerGoals,
        biggestChallenge: formData.biggestChallenge
      });
      
      // Clear the draft from localStorage on successful submission
      localStorage.removeItem(`profileDraft_${sessionId}`);
      
      navigate(`/session/${sessionId}/consent`);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gradient-subtle dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <InterviewHeader currentStep={2} totalSteps={7} stepLabel="Profile" />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Form Column */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary-light rounded-full mb-4">
                    <User className="w-8 h-8 text-brand-primary" aria-hidden="true" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Complete Your Profile
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Tell us a bit more about your career goals so we can personalize your interview experience.
                  </p>
                </div>

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(Optional)</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                  aria-invalid={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p id="phoneNumber-error" className="text-sm text-red-600 dark:text-red-400">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Career Pursuit
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">
                      Target Role / Position <span className="text-red-500" aria-label="required">*</span>
                    </Label>
                    <Input
                      id="targetRole"
                      type="text"
                      placeholder="e.g., Full Stack Developer, Data Scientist"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      required
                      aria-describedby={errors.targetRole ? 'targetRole-error' : undefined}
                      aria-invalid={!!errors.targetRole}
                    />
                    {errors.targetRole && (
                      <p id="targetRole-error" className="text-sm text-red-600 dark:text-red-400">
                        {errors.targetRole}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industryFocus">
                      Industry Focus <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(Select all that apply)</span>
                    </Label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {industryOptions.map((industry) => (
                          <button
                            key={industry}
                            type="button"
                            onClick={() => toggleIndustry(industry)}
                            className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 transform hover:scale-105 ${
                              formData.industryFocus.includes(industry)
                                ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-brand-secondary hover:shadow-sm'
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom industry..."
                          value={newIndustry}
                          onChange={(e) => setNewIndustry(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomIndustry();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addCustomIndustry}
                          disabled={!newIndustry.trim()}
                          variant="outline"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">
                      Experience Level <span className="text-red-500" aria-label="required">*</span>
                    </Label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                    >
                      <SelectTrigger id="experienceLevel" className="w-full" aria-required="true">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student - Currently learning</SelectItem>
                        <SelectItem value="entry-level">Entry Level - 0-1 years experience</SelectItem>
                        <SelectItem value="early-career">Early Career - 1-3 years experience</SelectItem>
                        <SelectItem value="mid-level">Mid Level - 3-5 years experience</SelectItem>
                        <SelectItem value="senior">Senior - 5+ years experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="careerGoals">
                      Career Goals <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(What are you hoping to achieve?)</span>
                    </Label>
                    <div className="space-y-3">
                      <textarea
                        id="careerGoals"
                        placeholder="Describe your career goals and aspirations..."
                        value={formData.careerGoals}
                        onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
                      />
                      <div className="flex flex-wrap gap-2">
                        {careerGoalSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => addCareerGoalSuggestion(suggestion)}
                            className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biggestChallenge">
                      Biggest Challenge <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(What's holding you back?)</span>
                    </Label>
                    <textarea
                      id="biggestChallenge"
                      placeholder="What's the biggest challenge you face in your career development?"
                      value={formData.biggestChallenge}
                      onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/session/${sessionId}/welcome`)}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Continue'}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Adaptive Preview Sidebar */}
      <div className="lg:col-span-1 order-1 lg:order-2">
        <div className="lg:sticky lg:top-28">
          <Card className="p-4 lg:p-6 bg-brand-gradient border-brand-secondary">
            <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 lg:mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-brand-secondary" />
              Interview Preview
              <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse ml-auto"></div>
            </h3>
            <div className="space-y-3 lg:space-y-4">
              {generateInterviewPreview()}
            </div>
          </Card>
        </div>
      </div>
    </div>
        </div>
      </main>
    </div>
  );
}
