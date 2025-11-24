import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      // Error toast is handled by axios interceptor
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your hiring control center."
      footer={
        <p className="text-center text-sm text-slate-400">
          New to Clarivue?{' '}
          <button onClick={() => navigate('/register')} className="text-sky-300 hover:text-sky-200 font-medium">
            Create an account
          </button>
        </p>
      }
    >
      <form onSubmit={handlePasswordLogin} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-100/80 border border-slate-200 text-slate-900 rounded-2xl pl-12 pr-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 mt-3"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <label>Password</label>
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-sky-600 hover:text-sky-500">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-100/80 border border-slate-200 text-slate-900 rounded-2xl pl-12 pr-12 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
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

        <Button
          type="submit"
          loading={loginMutation.isPending}
          variant="primary"
          size="lg"
          className="w-full"
          endIcon={<ArrowRight className="w-5 h-5" />}
        >
          {loginMutation.isPending ? 'Signing you in...' : 'Continue to dashboard'}
        </Button>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Link to="/register" className="block text-center text-sm font-medium text-slate-500 hover:text-slate-700">
          Explore Clarivue for free →
        </Link>
      </form>
    </AuthLayout>
  );
}
