import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '@/components/mockinterviews/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ArrowRight, User } from 'lucide-react';
import backend from '~backend/client';

export function CompleteProfilePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    targetRole: '',
    industryPreference: '',
    expectedGraduation: '',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetRole.trim()) {
      newErrors.targetRole = 'Target role is required';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!token) {
      setError('Invalid token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await backend.mockinterviews.completeProfile({
        token,
        phoneNumber: formData.phoneNumber || undefined,
        careerPursuit: {
          targetRole: formData.targetRole,
          industryPreference: formData.industryPreference || undefined,
          expectedGraduation: formData.expectedGraduation || undefined,
          skillLevel: formData.skillLevel
        }
      });

      if (response.success) {
        navigate(`/mockinterviews/consent/${token}`);
      } else {
        setError(response.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
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
                  <Label htmlFor="industryPreference">
                    Industry Preference <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="industryPreference"
                    type="text"
                    placeholder="e.g., FinTech, Healthcare, E-commerce"
                    value={formData.industryPreference}
                    onChange={(e) => setFormData({ ...formData, industryPreference: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedGraduation">
                    Expected Graduation Date <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="expectedGraduation"
                    type="date"
                    value={formData.expectedGraduation}
                    onChange={(e) => setFormData({ ...formData, expectedGraduation: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillLevel">
                    Current Skill Level <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Select.Root
                    value={formData.skillLevel}
                    onValueChange={(value) => setFormData({ ...formData, skillLevel: value as any })}
                  >
                    <Select.Trigger id="skillLevel" className="w-full" aria-required="true">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="beginner">Beginner - Learning the fundamentals</Select.Item>
                      <Select.Item value="intermediate">Intermediate - Building projects</Select.Item>
                      <Select.Item value="advanced">Advanced - Professional experience</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/mockinterviews/welcome/${token}`)}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? 'Saving...' : 'Continue'}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
