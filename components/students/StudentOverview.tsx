import { useState } from 'react';
import { Search } from 'lucide-react';
import { StudentTable } from './StudentTable';
import { semantic } from '../../utils/colors';
import type { Student, StudentFilterType } from '../../types';
import { Button } from '@/components/ui/button';
import { Dropdown } from '../ui/Dropdown';

interface StudentOverviewProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export function StudentOverview({ students, onStudentClick }: StudentOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StudentFilterType>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const roles = ['all', ...Array.from(new Set(students.map(s => s.role)))];
  const roleOptions = roles.map((role) => ({
    value: role,
    label: role === 'all' ? 'By Role' : role,
  }));
  const filters: Array<{ id: StudentFilterType; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'high-readiness', label: 'High Readiness (80+)' },
    { id: 'improving', label: 'Improving Fast' },
    { id: 'needs-support', label: 'Needs Support (<60)' },
  ];

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
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <Button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              variant={isActive ? 'primary' : 'outline'}
              size="md"
              className={`
                rounded-lg border ${semantic.borderMedium}
                transition-all whitespace-nowrap
                min-w-12
                focus:outline-none focus:ring-primary focus:border-transparent
              `}
            >
              {filter.label}
            </Button>
          );
        })}

        <Dropdown
          value={roleFilter}
          onChange={setRoleFilter}
          options={roleOptions}
          className="min-w-[140px]"
          placeholder="By Role"
        />
      </div>

      <StudentTable students={filteredStudents} onStudentClick={onStudentClick} />
    </div>
  );
}
