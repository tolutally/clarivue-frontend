import { useState } from 'react';
import { Users, TrendingUp, FileText, Award } from 'lucide-react';
import type { Advisor } from '../../types';
import { advisors as initialAdvisors, students } from '../../data/mock-data';
import { AdvisorCard } from './AdvisorCard';
import { AdvisorDetailView } from './AdvisorDetailView';
import { StudentAssignmentDialog } from './StudentAssignmentDialog';
import { backgrounds, borders, gradients, semantic } from '../../utils/colors';

export function AdvisorsPage() {
  const [advisors, setAdvisors] = useState(initialAdvisors);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  const totalActiveStudents = advisors.reduce((sum, a) => sum + a.activityMetrics.activeStudents, 0);
  const totalNotes = advisors.reduce((sum, a) => sum + a.activityMetrics.totalNotes, 0);
  const totalReviews = advisors.reduce((sum, a) => sum + a.activityMetrics.reviewsCompleted, 0);
  const avgResponseTime = advisors.length > 0
    ? (advisors.reduce((sum, a) => sum + a.activityMetrics.avgResponseTime, 0) / advisors.length).toFixed(1)
    : '0';

  const handleAssignStudents = (studentIds: string[]) => {
    if (!selectedAdvisor) return;

    setAdvisors(prevAdvisors =>
      prevAdvisors.map(advisor =>
        advisor.id === selectedAdvisor.id
          ? {
              ...advisor,
              assignedStudents: studentIds,
              activityMetrics: {
                ...advisor.activityMetrics,
                activeStudents: studentIds.length
              }
            }
          : advisor
      )
    );

    setSelectedAdvisor(prev =>
      prev
        ? {
            ...prev,
            assignedStudents: studentIds,
            activityMetrics: {
              ...prev.activityMetrics,
              activeStudents: studentIds.length
            }
          }
        : null
    );
  };

  if (selectedAdvisor) {
    return (
      <>
        <AdvisorDetailView
          advisor={selectedAdvisor}
          onBack={() => setSelectedAdvisor(null)}
          onAssignStudent={() => setShowAssignmentDialog(true)}
        />
        {showAssignmentDialog && (
          <StudentAssignmentDialog
            advisor={selectedAdvisor}
            allStudents={students}
            onAssign={handleAssignStudents}
            onClose={() => setShowAssignmentDialog(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${semantic.textPrimary} mb-2`}>Advisors</h1>
        <p className={semantic.textSecondary}>Manage advisor assignments and track mentorship activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`bg-gradient-to-br from-[#102C64]/10 to-[#102C64]/5 rounded-xl p-6 border ${borders.primaryLight}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${backgrounds.primary} rounded-lg`}>
              <Users size={24} className="text-white" />
            </div>
            <h3 className={`text-sm font-medium ${semantic.textSecondary}`}>Active Advisors</h3>
          </div>
          <div className={`text-3xl font-bold ${semantic.textPrimary}`}>{advisors.length}</div>
          <p className={`text-sm ${semantic.textSecondary} mt-1`}>
            {advisors.filter(a => a.activityMetrics.activeStudents > 0).length} with students
          </p>
        </div>

        <div className={`bg-gradient-to-br from-[#FE686D]/10 to-[#FE686D]/5 rounded-xl p-6 border ${borders.accentLight}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${backgrounds.accent} rounded-lg`}>
              <TrendingUp size={24} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Students Supported</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalActiveStudents}</div>
          <p className="text-sm text-gray-600 mt-1">Across all advisors</p>
        </div>

        <div className={`bg-gradient-to-br from-[#C8A0FE]/10 to-[#C8A0FE]/5 rounded-xl p-6 border ${borders.secondaryLight}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${backgrounds.secondary} rounded-lg`}>
              <FileText size={24} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Notes</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalNotes}</div>
          <p className="text-sm text-gray-600 mt-1">{totalReviews} reviews completed</p>
        </div>

        <div className={`bg-gradient-to-br from-[#B8CCF4]/10 to-[#B8CCF4]/5 rounded-xl p-6 border ${borders.tertiaryLight}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${backgrounds.tertiary} rounded-lg`}>
              <Award size={24} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Avg Response</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{avgResponseTime}h</div>
          <p className="text-sm text-gray-600 mt-1">Time to student notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisors.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            advisor={advisor}
            onClick={() => setSelectedAdvisor(advisor)}
          />
        ))}
      </div>
    </div>
  );
}
