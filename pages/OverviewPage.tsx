import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { StudentGrid } from '../components/StudentGrid';
import { AnalyticsSummary } from '../components/AnalyticsSummary';
import { ReadinessOverview } from '../components/ReadinessOverview';
import { CompetencyHeatmap } from '../components/CompetencyHeatmap';
import { AdvisorInsights } from '../components/AdvisorInsights';
import { Dropdown } from '../components/ui/Dropdown';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { students, competencies } from '../data/mock-data';
import { semantic } from '../utils/colors';

export function OverviewPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className={`min-h-screen ${semantic.surfaceActive}`}>
      <Header 
        activeTab="overview" 
        onTabChange={(tab) => {
          if (tab === 'overview') navigate('/overview');
          if (tab === 'cohorts') navigate('/cohorts');
          if (tab === 'students') navigate('/students');
          if (tab === 'reports') navigate('/reports');
        }} 
      />
      
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-5 flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className={semantic.textSecondary}>Track student progress and interview readiness</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Dropdown
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: 'week', label: 'Past Week' },
                { value: 'month', label: 'Past Month' },
                { value: 'quarter', label: 'Past Quarter' },
                { value: 'all', label: 'All Time' },
              ]}
              className="w-48"
            />
          </div>
        </div>

        <div className="mb-8">
          <ReadinessOverview students={students} />
        </div>

        <div className="mb-8">
          <AnalyticsSummary students={students} />
        </div>

        <div className="mb-8">
          <CompetencyHeatmap students={students} competencies={competencies} />
        </div>

        <div className="mb-8">
          <AdvisorInsights />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Students</h2>
            <Button
              onClick={() => navigate('/students')}
              variant="ghost"
              endIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All
            </Button>
          </div>
          <StudentGrid students={students.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
