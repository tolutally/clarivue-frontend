import { semantic, backgrounds, gradients } from '../utils/colors';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'students', label: 'Students' },
  { id: 'advisors', label: 'Advisors' },
  { id: 'reports', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className={`${semantic.surface} border-b ${semantic.borderMedium} sticky top-0 z-50`}>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/clarivue -logo.png" alt="Clarivue" className="h-8" />
          </div>
          
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#102C64] text-white'
                    : `${semantic.textSecondary} hover:${semantic.textPrimary} ${semantic.bgHover}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
