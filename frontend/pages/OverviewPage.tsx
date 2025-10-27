import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { StudentGrid } from '../components/StudentGrid';
import { AnalyticsSummary } from '../components/AnalyticsSummary';
import { ReadinessOverview } from '../components/ReadinessOverview';
import { CompetencyHeatmap } from '../components/CompetencyHeatmap';
import { AdvisorInsights } from '../components/AdvisorInsights';
import { students, competencies } from '../data/mock-data';
import { semantic } from '../utils/colors';

export function OverviewPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className={`min-h-screen ${semantic.bgHover}`}>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className={semantic.textSecondary}>Track student progress and interview readiness</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <ReadinessOverview students={students} />
          </div>
        </div>

        <div className="mb-8">
          <AnalyticsSummary />
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
            <button
              onClick={() => navigate('/students')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <StudentGrid students={students.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
