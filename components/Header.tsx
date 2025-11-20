import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Users, 
  GraduationCap, 
  UserCheck, 
  BarChart2, 
  Settings 
} from 'lucide-react';
import { Button } from './ui/button';
import { semantic, backgrounds, gradients } from '../utils/colors';

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
  { id: 'advisors', label: 'Advisors', disabled: true },
  { id: 'reports', label: 'Analytics' },
  { id: 'settings', label: 'Settings', disabled: true },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

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
          <div className={`flex items-center justify-end p-3 border-b ${semantic.borderMedium}`}>
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
        </div>
      </div>
    </>
  );
}
