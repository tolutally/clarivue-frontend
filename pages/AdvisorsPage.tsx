import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AdvisorsPage as AdvisorsManagementPage } from '../components/advisors/AdvisorsPage';
import { backgrounds } from '@/utils/colors';
import { navigateFromDashboardTab } from '@/utils/dashboardTabNavigation';

export function AdvisorsPage() {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${backgrounds.surfaceActive}`}>
      <Header activeTab="advisors" onTabChange={(tab) => navigateFromDashboardTab(navigate, tab)} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <AdvisorsManagementPage />
      </div>
    </div>
  );
}
