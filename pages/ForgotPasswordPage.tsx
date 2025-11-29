import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendPasswordResetOtp } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const sendOtp = useSendPasswordResetOtp();
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await sendOtp.mutateAsync({ email });
      setOtpSent(true);
    } catch (error) {
      // Error toast is handled by axios interceptor
    }
  };

  return (
    <AuthLayout
      title={otpSent ? 'We sent a reset link' : 'Forgot your password?'}
      subtitle={
        otpSent
          ? `Check your inbox at ${email}`
          : "Enter the email associated with your account and we'll send a reset code."
      }
      footer={
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </button>
      }
    >
      {otpSent ? (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto">
            <Mail className="w-9 h-9 text-emerald-500" />
          </div>
          <p className="text-slate-600">
            We just sent a verification code to <span className="text-slate-900 font-semibold">{email}</span>. Enter the code
            within 10 minutes to reset your password.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/forgot-password/verify', { state: { email } })}
              variant="primary"
              className="w-full bg-sky-400 hover:bg-sky-300 text-slate-900 font-semibold rounded-2xl"
              endIcon={<ArrowRight className="w-5 h-5" />}
            >
              Enter verification code
            </Button>
            <Button
              onClick={() => setOtpSent(false)}
              variant="ghost"
              className="w-full text-slate-600 hover:text-slate-900 rounded-2xl border border-slate-200"
            >
              Use a different email
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={sendOtp.isPending}
            variant="primary"
            size="lg"
            className="w-full"
            endIcon={<ArrowRight className="w-5 h-5" />}
          >
            {sendOtp.isPending ? 'Sending link...' : 'Send verification code'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

