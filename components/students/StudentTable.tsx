import { useState } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { CircularProgress } from '../charts/CircularProgress';
import { semantic, shadows, backgrounds, hover } from '../../utils/colors';
import type { Student } from '../../types';

interface StudentTableProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

type SortField = 'name' | 'role' | 'readinessScore' | 'improvement' | 'lastInterviewDate';
type SortDirection = 'asc' | 'desc';

export function StudentTable({ students, onStudentClick }: StudentTableProps) {
  const [sortField, setSortField] = useState<SortField>('readinessScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'lastInterviewDate') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${semantic.bgSubtle} border-b ${semantic.border}`}>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className={`px-6 py-4 text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider cursor-pointer ${hover.primaryLight} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  Student <SortIcon field="name" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('role')}
                className={`px-6 py-4 text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider cursor-pointer ${hover.primaryLight} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  Role Practiced <SortIcon field="role" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('readinessScore')}
                className={`px-6 py-4 text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider cursor-pointer ${hover.primaryLight} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  Readiness Score <SortIcon field="readinessScore" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('improvement')}
                className={`px-6 py-4 text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider cursor-pointer ${hover.primaryLight} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  Improvement <SortIcon field="improvement" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('lastInterviewDate')}
                className={`px-6 py-4 text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider cursor-pointer ${hover.primaryLight} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  Last Interview <SortIcon field="lastInterviewDate" />
                </div>
              </th>
              <th className={`px-6 py-4 text-right text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${semantic.border}`}>
            {sortedStudents.map((student) => (
              <tr 
                key={student.id}
                onClick={() => onStudentClick(student)}
                className={`${hover.primaryLight} transition-colors cursor-pointer`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#102c64] to-[#B8CCF4] flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(student.name)}
                    </div>
                    <div className={`font-medium ${semantic.textPrimary}`}>{student.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${semantic.textSecondary}`}>{student.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <CircularProgress value={student.readinessScore} size={48} />
                    <span className={`text-sm font-semibold ${semantic.textPrimary}`}>{student.readinessScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    student.improvement > 0 ? semantic.success : semantic.danger
                  }`}>
                    {student.improvement > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {student.improvement > 0 ? '+' : ''}{student.improvement}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${semantic.textSecondary}`}>{student.lastInterviewDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStudentClick(student);
                    }}
                    className={`px-4 py-2 ${backgrounds.primary} text-white text-sm font-medium rounded-lg ${hover.primary} transition-colors`}
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
