import { StudentCard } from './StudentCard';
import { students } from '../data/mock-data';

export function StudentGrid() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#001223] mb-4">Student Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
