import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendPasswordResetOtp } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

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

  if (otpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset code to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Enter the code below to reset your password. The code expires in 10 minutes.
            </p>
            <Button
              onClick={() => navigate('/forgot-password/verify', { state: { email } })}
              variant="primary"
              className="w-full"
              endIcon={<ArrowRight className="w-5 h-5" />}
            >
              Enter Verification Code
            </Button>
            <Button
              onClick={() => setOtpSent(false)}
              variant="ghost"
              className="w-full mt-3"
            >
              Use a different email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/clarivue-logo.png" alt="Clarivue" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email and we'll send you a verification code</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={sendOtp.isPending}
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              endIcon={<ArrowRight className="w-5 h-5" />}
            >
              {sendOtp.isPending ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
              startIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

