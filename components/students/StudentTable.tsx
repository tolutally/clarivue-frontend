import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { CircularProgress } from '../charts/CircularProgress';
import { semantic, shadows, backgrounds, hover } from '../../utils/colors';
import type { Student } from '../../types';
import { Button } from '../ui/button';

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

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'lastInterviewDate') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0;
        bValue = bValue ? new Date(bValue as string).getTime() : 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const aNum = typeof aValue === 'number' ? aValue : 0;
      const bNum = typeof bValue === 'number' ? bValue : 0;

      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, [students, sortField, sortDirection]);

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

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <div className="text-lg font-semibold text-slate-900">No students match your filters</div>
      <p className="text-sm text-slate-500 max-w-md">
        Try adjusting the search terms or filters to find students. Once they match, they'll appear here.
      </p>
    </div>
  );

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
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={6}>{renderEmptyState()}</td>
              </tr>
            ) : (
              sortedStudents.map((student) => (
                <tr 
                key={student.id}
                onClick={() => onStudentClick(student)}
                className={`${hover.surfaceLight} transition-colors cursor-pointer`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#102c64] to-[#B8CCF4] flex items-center justify-center text-white font-semibold text-sm">
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
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStudentClick(student);
                    }}
                  >
                    View Report
                  </Button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
