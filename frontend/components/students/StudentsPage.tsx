import { useState } from 'react';
import type { Student } from '../../types';
import { StudentOverview } from './StudentOverview';
import { StudentDetailView } from './StudentDetailView';
import { students } from '../../data/mock-data';

export function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (selectedStudent) {
    return (
      <StudentDetailView 
        student={selectedStudent} 
        onBack={() => setSelectedStudent(null)} 
      />
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
