import { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { ReportsPageSkeleton } from './components/skeletons/ReportsPageSkeleton';
import { StudentsPageSkeleton } from './components/skeletons/StudentsPageSkeleton';
import { AdvisorsPageSkeleton } from './components/skeletons/AdvisorsPageSkeleton';
import { OverviewPageSkeleton } from './components/skeletons/OverviewPageSkeleton';
import './styles/theme.css';

const ReadinessOverview = lazy(() => import('./components/ReadinessOverview').then(module => ({ default: module.ReadinessOverview })));
const CompetencyHeatmap = lazy(() => import('./components/CompetencyHeatmap').then(module => ({ default: module.CompetencyHeatmap })));
const StudentGrid = lazy(() => import('./components/StudentGrid').then(module => ({ default: module.StudentGrid })));
const AnalyticsSummary = lazy(() => import('./components/AnalyticsSummary').then(module => ({ default: module.AnalyticsSummary })));
const StudentsPage = lazy(() => import('./components/students/StudentsPage').then(module => ({ default: module.StudentsPage })));
const AdvisorsPage = lazy(() => import('./components/advisors/AdvisorsPage').then(module => ({ default: module.AdvisorsPage })));
const ReportsPage = lazy(() => import('./components/reports/ReportsPage').then(module => ({ default: module.ReportsPage })));

function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'reports' && (
        <Suspense fallback={<ReportsPageSkeleton />}>
          <ReportsPage />
        </Suspense>
      )}

      {activeTab === 'students' && (
        <Suspense fallback={<StudentsPageSkeleton />}>
          <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
            <StudentsPage />
          </main>
        </Suspense>
      )}

      {activeTab === 'advisors' && (
        <Suspense fallback={<AdvisorsPageSkeleton />}>
          <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
            <AdvisorsPage />
          </main>
        </Suspense>
      )}

      {activeTab === 'overview' && (
        <Suspense fallback={<OverviewPageSkeleton />}>
          <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
            <ReadinessOverview />
            <AnalyticsSummary />
            <div className="grid grid-cols-1 gap-8">
              <CompetencyHeatmap />
            </div>
            <StudentGrid />
          </main>
        </Suspense>
      )}

      {activeTab !== 'overview' && activeTab !== 'students' && activeTab !== 'reports' && activeTab !== 'advisors' && (
        <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-gray-600">This page is coming soon...</p>
          </div>
        </main>
      )}
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
