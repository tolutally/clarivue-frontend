import { StudentCard } from './StudentCard';
import { students } from '../data/mock-data';
import { Card } from '@/components/ui/card';
import type { Student } from '../types';

interface StudentGridProps {
  students: Student[];
}

export function StudentGrid({ students }: StudentGridProps) {
  const sortedStudents = [...students].sort((a, b) => b.improvement - a.improvement);

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#001223] mb-4">Most Improved Interview Performance</h3>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Readiness
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Improvement
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Trend
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
