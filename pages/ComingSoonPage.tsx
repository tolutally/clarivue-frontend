import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function ComingSoonPage() {
  const { admin } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  const getUserName = () => {
    if (!admin?.user) return 'User';
    return admin.user.name || admin.user.email || 'User';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/clarivue-logo.png" alt="Clarivue" className="h-8" />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {getUserName()}
              </span>
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="ghost"
                startIcon={<LogOut className="w-4 h-4" />}
                className="text-gray-700 hover:text-gray-900"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your dashboard is currently being prepared. We're working hard to bring you an amazing experience!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <p className="text-sm text-gray-700">
                Our team is building something special for your role. You'll be notified as soon as your dashboard is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

