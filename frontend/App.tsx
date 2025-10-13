import { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ReadinessOverview } from './components/ReadinessOverview';
import { CompetencyHeatmap } from './components/CompetencyHeatmap';
import { StudentGrid } from './components/StudentGrid';
import { AdvisorInsights } from './components/AdvisorInsights';
import { FeedbackSummary } from './components/FeedbackSummary';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import './styles/theme.css';

const StudentsPage = lazy(() => import('./components/students/StudentsPage').then(module => ({ default: module.StudentsPage })));
const AdvisorsPage = lazy(() => import('./components/advisors/AdvisorsPage').then(module => ({ default: module.AdvisorsPage })));
const ReportsPage = lazy(() => import('./components/reports/ReportsPage').then(module => ({ default: module.ReportsPage })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
