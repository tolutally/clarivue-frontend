import { useState } from 'react';
import { Header } from './components/Header';
import { ReadinessOverview } from './components/ReadinessOverview';
import { CompetencyHeatmap } from './components/CompetencyHeatmap';
import { StudentGrid } from './components/StudentGrid';
import { AdvisorInsights } from './components/AdvisorInsights';
import { FeedbackSummary } from './components/FeedbackSummary';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { StudentsPage } from './components/students/StudentsPage';
import { AdvisorsPage } from './components/advisors/AdvisorsPage';
import { ReportsPage } from './components/reports/ReportsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'reports' ? (
        <ReportsPage />
      ) : (
      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {activeTab === 'overview' && (
          <>
            <ReadinessOverview />
            
            <AnalyticsSummary />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <CompetencyHeatmap />
              </div>
              
              <div className="space-y-8">
                <AdvisorInsights />
              </div>
            </div>
            
            <StudentGrid />
          </>
        )}

        {activeTab === 'students' && <StudentsPage />}

        {activeTab === 'advisors' && <AdvisorsPage />}

        {activeTab !== 'overview' && activeTab !== 'students' && activeTab !== 'advisors' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-gray-600">This page is coming soon...</p>
          </div>
        )}
      </main>
      )}
    </div>
  );
}
