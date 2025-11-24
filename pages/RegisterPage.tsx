import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Building, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const registerMutation = useRegister();

  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const missingRequirements = [];
    if (!passwordRequirements.length) missingRequirements.push('at least 8 characters');
    if (!passwordRequirements.uppercase) missingRequirements.push('one uppercase letter');
    if (!passwordRequirements.lowercase) missingRequirements.push('one lowercase letter');
    if (!passwordRequirements.number) missingRequirements.push('one number');
    if (!passwordRequirements.special) missingRequirements.push('one special character');

    if (missingRequirements.length > 0) {
      setFormError(`Please include ${missingRequirements.join(', ')} in your password.`);
      return;
    }

    setFormError(null);

    try {
      await registerMutation.mutateAsync({
        name,
        email,
        company_name: companyName,
        password,
      });
    } catch (error) {
      // Error toast is handled by axios interceptor
    }
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  return (
    <AuthLayout
      title="Create your Clarivue workspace"
      subtitle="Collaborate with hiring teams, automate interviews, and delight candidates."
      contentWidthClass="max-w-2xl"
      footer={
        <p className="text-center text-sm text-slate-500">
          Already onboard?{' '}
          <Link to="/login" className="text-sky-600 hover:text-sky-500 font-medium">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Lee"
                className="w-full bg-[#EDF4FF] border border-transparent rounded-2xl pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-200"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#EDF4FF] border border-transparent rounded-2xl pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-200"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Company Name</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Clarivue Labs"
                className="w-full bg-[#EDF4FF] border border-transparent rounded-2xl pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-200"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
              <span>Password</span>
              <span className="text-xs font-normal text-slate-500">Must include A-Z, a-z, 0-9, symbol</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-[#EDF4FF] border border-transparent rounded-2xl pl-12 pr-12 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-[#EDF4FF] border border-transparent rounded-2xl pl-12 pr-12 py-3 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-rose-500">Passwords do not match</p>
            )}
          </div>
        </div>

        {formError && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <Button
          type="submit"
          loading={registerMutation.isPending}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating your workspace...' : 'Launch Clarivue'}
        </Button>
      </form>
    </AuthLayout>
  );
}
