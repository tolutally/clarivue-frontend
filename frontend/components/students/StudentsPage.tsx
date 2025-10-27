import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../../types';
import { Header } from '../Header';
import { StudentOverview } from './StudentOverview';
import { students } from '../../data/mock-data';

const StudentDetailView = lazy(() => import('./StudentDetailView').then(module => ({ default: module.StudentDetailView })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading interview details...</p>
    </div>
  </div>
);

export function StudentsPage() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)]">
        <Header activeTab="students" onTabChange={(tab) => {
          if (tab === 'overview') navigate('/overview');
          if (tab === 'cohorts') navigate('/cohorts');
          if (tab === 'students') navigate('/students');
          if (tab === 'reports') navigate('/reports');
        }} />
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <Suspense fallback={<LoadingFallback />}>
            <StudentDetailView 
              student={selectedStudent} 
              onBack={() => setSelectedStudent(null)} 
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <Header activeTab="students" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
            <p className="text-gray-600">Track progress and readiness across mock interviews</p>
          </div>
          
          <StudentOverview 
            students={students} 
            onStudentClick={setSelectedStudent}
          />
        </div>
      </div>
    </div>
  );
}
