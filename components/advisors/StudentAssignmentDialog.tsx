import { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import type { Student, Advisor } from '../../types';
import { backgrounds, borders, semantic, shadows } from '../../utils/colors';

interface StudentAssignmentDialogProps {
  advisor: Advisor;
  allStudents: Student[];
  onAssign: (studentIds: string[]) => void;
  onClose: () => void;
}

export function StudentAssignmentDialog({ advisor, allStudents, onAssign, onClose }: StudentAssignmentDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(advisor.assignedStudents)
  );

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSave = () => {
    onAssign(Array.from(selectedStudents));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${semantic.surface} rounded-2xl ${shadows.lg} max-w-2xl w-full max-h-[90vh] flex flex-col`}>
        <div className={`flex items-center justify-between p-6 border-b ${semantic.borderMedium}`}>
          <div>
            <h2 className={`text-2xl font-bold ${semantic.textPrimary}`}>Assign Students</h2>
            <p className={`${semantic.textSecondary} mt-1`}>Manage student assignments for {advisor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className={semantic.textTertiary} />
          </button>
        </div>

        <div className={`p-6 border-b ${semantic.borderMedium}`}>
          <div className="relative">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${semantic.textMuted}`} />
            <input
              type="text"
              placeholder="Search students by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A0FE] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredStudents.map((student) => {
              const isSelected = selectedStudents.has(student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${borders.secondary} bg-[#C8A0FE]/10`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isSelected
                        ? `${backgrounds.secondary} text-white`
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${semantic.textPrimary}`}>{student.name}</h3>
                      <p className={`text-sm ${semantic.textSecondary}`}>{student.role}</p>
                    </div>
                    <div className="text-right mr-4">
                      <div className={`text-sm font-medium ${semantic.textPrimary}`}>Readiness: {student.readinessScore}%</div>
                      <div className={`text-xs ${semantic.textSecondary}`}>{student.interviewCount} interviews</div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? `${borders.secondary} ${backgrounds.secondary}`
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && <Check size={16} className="text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`flex items-center justify-between p-6 border-t ${semantic.borderMedium} ${semantic.bgSubtle}`}>
          <div className={`text-sm ${semantic.textSecondary}`}>
            {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-2 ${backgrounds.primary} text-white rounded-lg hover:bg-[#102C64]/90 transition-colors font-medium`}
            >
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
