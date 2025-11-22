import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otpCode = location.state?.otpCode || '';
  const [newPassword, setNewPassword] = useState('');
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
  const resetPassword = useResetPassword();

  useEffect(() => {
    if (!email || !otpCode) {
      navigate('/forgot-password');
    }
  }, [email, otpCode, navigate]);

  useEffect(() => {
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setPasswordRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    });
  }, [newPassword]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    if (passwordStrength < 3) {
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email,
        otp_code: otpCode,
        new_password: newPassword,
      });
    } catch (error) {
      // Error toast is handled by axios interceptor
    }
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/clarivue-logo.png" alt="Clarivue" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Create a new secure password for your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Password Strength</span>
                    <span className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircle className={`w-3 h-3 ${passwordRequirements.length ? '' : 'opacity-30'}`} />
                      At least 8 characters
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircle className={`w-3 h-3 ${passwordRequirements.uppercase ? '' : 'opacity-30'}`} />
                      One uppercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircle className={`w-3 h-3 ${passwordRequirements.lowercase ? '' : 'opacity-30'}`} />
                      One lowercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircle className={`w-3 h-3 ${passwordRequirements.number ? '' : 'opacity-30'}`} />
                      One number
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircle className={`w-3 h-3 ${passwordRequirements.special ? '' : 'opacity-30'}`} />
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              loading={resetPassword.isPending}
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              endIcon={<ArrowRight className="w-5 h-5" />}
              disabled={!allRequirementsMet || newPassword !== confirmPassword}
            >
              {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
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

