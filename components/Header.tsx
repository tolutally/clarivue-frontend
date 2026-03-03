import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Users, 
  GraduationCap, 
  UserCheck, 
  BarChart2, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { semantic, backgrounds, gradients } from '../utils/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '@/hooks/useAuth';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Define a mapping of tab.id to their respective icons (lucide-react)
const tabIcons: Record<string, React.ReactNode> = {
  overview: <LayoutGrid className="w-5 h-5" />,
  cohorts: <Users className="w-5 h-5" />,
  students: <GraduationCap className="w-5 h-5" />,
  advisors: <UserCheck className="w-5 h-5" />,
  reports: <BarChart2 className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
};

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'cohorts', label: 'Cohorts' },
  { id: 'students', label: 'Students' },
  { id: 'advisors', label: 'Advisory' },
  { id: 'reports', label: 'Analytics' },
  { id: 'settings', label: 'Settings', disabled: true },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { admin } = useAuth();
  const logoutMutation = useLogout();

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Error toast is handled by axios interceptor
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (admin?.user?.name) {
      const names = admin.user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return admin.user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return admin?.user?.name || admin?.user?.email || 'User';
  };

  const getUserEmail = () => {
    return admin?.user?.email || '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`${semantic.surface} border-b ${semantic.borderMedium} sticky top-0 z-50`}>
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/clarivue-logo.png" alt="Clarivue" className="h-8" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => !tab.disabled && handleTabChange(tab.id)}
                  disabled={tab.disabled}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="md"
                  textPosition="left"
                  startIcon={tabIcons[tab.id]}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>

            {/* Profile Avatar & Dropdown - Desktop */}
            <div className="hidden lg:block relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer ${
                  profileDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
                aria-label="User menu"
                aria-expanded={profileDropdownOpen}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white text-base font-semibold shrink-0"
                  style={{ lineHeight: 1 }} // ensure line-height does not distort centering
                >
                  <span className="flex items-center justify-center w-full h-full">
                    {getUserInitials()}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 shrink-0 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">{getUserName()}</p>
                    {getUserEmail() && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{getUserEmail()}</p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${semantic.textPrimary} ${semantic.bgHover} transition-colors`}
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 ${semantic.surface} shadow-xl z-70 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className={`flex items-center justify-between p-3 border-b ${semantic.borderMedium}`}>
            {/* User Profile - Top */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{getUserName()}</p>
                {getUserEmail() && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{getUserEmail()}</p>
                )}
              </div>
            </div>
            <Button
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${semantic.textPrimary} ${semantic.bgHover} transition-colors`}
              variant="ghost"
              size="icon"
              aria-label="Close menu"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Drawer Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => !tab.disabled && handleTabChange(tab.id)}
                  disabled={tab.disabled}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="lg"
                  textPosition="left"
                  startIcon={tabIcons[tab.id]}
                  className="flex items-center"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </nav>

          {/* Logout Button - Bottom */}
          <div className={`border-t ${semantic.borderMedium} p-4`}>
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              variant="ghost"
              size="lg"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              startIcon={<LogOut className="w-4 h-4" />}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
