import { useState, lazy, Suspense } from 'react';
import type { Student } from '../../types';
import { StudentOverview } from './StudentOverview';
import { students } from '../../data/mock-data';

const StudentDetailView = lazy(() => import('./StudentDetailView').then(module => ({ default: module.StudentDetailView })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading student details...</p>
    </div>
  </div>
);

export function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (selectedStudent) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <StudentDetailView 
          student={selectedStudent} 
          onBack={() => setSelectedStudent(null)} 
        />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
        <p className="text-gray-600">Track student progress and readiness across mock interviews</p>
      </div>
      
      <StudentOverview 
        students={students} 
        onStudentClick={setSelectedStudent}
      />
    </div>
  );
}
