import { useState } from 'react';
import { Search } from 'lucide-react';
import { StudentTable } from './StudentTable';
import { semantic, backgrounds, hover } from '../../utils/colors';
import type { Student, StudentFilterType } from '../../types';

interface StudentOverviewProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export function StudentOverview({ students, onStudentClick }: StudentOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StudentFilterType>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const roles = ['all', ...Array.from(new Set(students.map(s => s.role)))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'high-readiness') {
      matchesFilter = student.readinessScore >= 80;
    } else if (activeFilter === 'improving') {
      matchesFilter = student.improvement >= 15;
    } else if (activeFilter === 'needs-support') {
      matchesFilter = student.readinessScore < 60;
    }

    const matchesRole = roleFilter === 'all' || student.role === roleFilter;

    return matchesSearch && matchesFilter && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${semantic.textMuted}`} />
        <input
          type="text"
          placeholder="Search students by name or role…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 ${semantic.surface} border ${semantic.borderMedium} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102c64]/20 focus:border-[#102c64] transition-all`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? `${backgrounds.primary} text-white shadow-md`
              : `${semantic.surface} ${semantic.textSecondary} ${hover.primaryLight} border ${semantic.borderMedium}`
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('high-readiness')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'high-readiness'
              ? `${backgrounds.primary} text-white shadow-md`
              : `${semantic.surface} ${semantic.textSecondary} ${hover.primaryLight} border ${semantic.borderMedium}`
          }`}
        >
          High Readiness (80+)
        </button>
        <button
          onClick={() => setActiveFilter('improving')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'improving'
              ? `${backgrounds.primary} text-white shadow-md`
              : `${semantic.surface} ${semantic.textSecondary} ${hover.primaryLight} border ${semantic.borderMedium}`
          }`}
        >
          Improving Fast
        </button>
        <button
          onClick={() => setActiveFilter('needs-support')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'needs-support'
              ? `${backgrounds.primary} text-white shadow-md`
              : `${semantic.surface} ${semantic.textSecondary} ${hover.primaryLight} border ${semantic.borderMedium}`
          }`}
        >
          Needs Support (&lt;60)
        </button>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${semantic.surface} ${semantic.textSecondary} border ${semantic.borderMedium} ${hover.primaryLight} focus:outline-none focus:ring-2 focus:ring-[#102c64]/20 transition-all`}
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === 'all' ? 'By Role' : role}
            </option>
          ))}
        </select>
      </div>

      <StudentTable students={filteredStudents} onStudentClick={onStudentClick} />
    </div>
  );
}
