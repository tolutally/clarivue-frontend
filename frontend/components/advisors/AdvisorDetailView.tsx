import { ArrowLeft, Mail, Users, TrendingUp, FileText, Clock, UserPlus } from 'lucide-react';
import type { Advisor, Student } from '../../types';
import { students } from '../../data/mock-data';
import { backgrounds, borders, gradients, text, semantic, shadows, hover } from '../../utils/colors';

interface AdvisorDetailViewProps {
  advisor: Advisor;
  onBack: () => void;
  onAssignStudent: () => void;
}

export function AdvisorDetailView({ advisor, onBack, onAssignStudent }: AdvisorDetailViewProps) {
  const assignedStudents = students.filter(s => advisor.assignedStudents.includes(s.id));
  const avgReadiness = assignedStudents.length > 0
    ? Math.round(assignedStudents.reduce((sum, s) => sum + s.readinessScore, 0) / assignedStudents.length)
    : 0;
  const avgImprovement = assignedStudents.length > 0
    ? Math.round(assignedStudents.reduce((sum, s) => sum + s.improvement, 0) / assignedStudents.length)
    : 0;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 ${semantic.textSecondary} hover:${semantic.textPrimary} transition-colors`}
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Advisors</span>
      </button>

      <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-8`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-white text-3xl font-semibold`}>
              {advisor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${semantic.textPrimary} mb-1`}>{advisor.name}</h1>
              <p className={`text-lg ${semantic.textSecondary} mb-2`}>{advisor.title}</p>
              <div className={`flex items-center gap-2 ${semantic.textTertiary}`}>
                <Mail size={16} />
                <a href={`mailto:${advisor.contactEmail}`} className={`hover:${text.primary} transition-colors`}>
                  {advisor.contactEmail}
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={onAssignStudent}
            className={`flex items-center gap-2 px-4 py-2 ${backgrounds.primary} text-white rounded-lg hover:bg-[#102C64]/90 transition-colors font-medium`}
          >
            <UserPlus size={18} />
            Assign Student
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {advisor.specializations.map((spec, index) => {
            const bgColors = [
              backgrounds.secondaryLight,
              backgrounds.tertiaryLight,
              backgrounds.accentLight,
            ];
            const textColors = ['text-[#C8A0FE]', 'text-[#102C64]', 'text-[#FE686D]'];
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];
            
            return (
              <span
                key={spec}
                className={`px-3 py-1.5 ${bgColor} ${textColor} rounded-lg text-sm font-medium`}
              >
                {spec}
              </span>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={`bg-gradient-to-br from-[#102C64]/10 to-[#102C64]/5 rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${text.primary} mb-2`}>
              <Users size={18} />
              <span className="text-sm font-medium">Active Students</span>
            </div>
            <div className={`text-3xl font-bold ${semantic.textPrimary}`}>{advisor.activityMetrics.activeStudents}</div>
          </div>
          <div className={`bg-gradient-to-br from-[#FE686D]/10 to-[#FE686D]/5 rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${text.accent} mb-2`}>
              <FileText size={18} />
              <span className="text-sm font-medium">Total Notes</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{advisor.activityMetrics.totalNotes}</div>
          </div>
          <div className={`bg-gradient-to-br from-[#C8A0FE]/10 to-[#C8A0FE]/5 rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${text.secondary} mb-2`}>
              <TrendingUp size={18} />
              <span className="text-sm font-medium">Reviews Done</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{advisor.activityMetrics.reviewsCompleted}</div>
          </div>
          <div className={`bg-gradient-to-br from-[#B8CCF4]/10 to-[#B8CCF4]/5 rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${text.tertiary} mb-2`}>
              <Clock size={18} />
              <span className="text-sm font-medium">Avg Response</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{advisor.activityMetrics.avgResponseTime}h</div>
          </div>
        </div>
      </div>

      {assignedStudents.length > 0 && (
        <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${semantic.textPrimary}`}>Assigned Students</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${backgrounds.secondary} rounded-full`}></div>
                <span className={semantic.textSecondary}>Avg Readiness: <span className={`font-semibold ${semantic.textPrimary}`}>{avgReadiness}%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${backgrounds.accent} rounded-full`}></div>
                <span className={semantic.textSecondary}>Avg Improvement: <span className={`font-semibold ${semantic.textPrimary}`}>+{avgImprovement}%</span></span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${semantic.borderMedium}`}>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Student</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Role</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Readiness</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Improvement</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Interviews</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${semantic.textSecondary}`}>Last Session</th>
                </tr>
              </thead>
              <tbody>
                {assignedStudents.map((student) => (
                  <tr key={student.id} className={`border-b ${semantic.border} ${hover.primaryLight} transition-colors`}>
                    <td className="py-4 px-4">
                      <div className={`font-medium ${semantic.textPrimary}`}>{student.name}</div>
                    </td>
                    <td className={`py-4 px-4 ${semantic.textSecondary}`}>{student.role}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              student.readinessScore >= 75
                                ? 'bg-green-500'
                                : student.readinessScore >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${student.readinessScore}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${semantic.textPrimary} min-w-[3ch]`}>{student.readinessScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 ${semantic.success} font-medium`}>
                        <TrendingUp size={14} />
                        +{student.improvement}%
                      </span>
                    </td>
                    <td className={`py-4 px-4 ${semantic.textPrimary} font-medium`}>{student.interviewCount}</td>
                    <td className={`py-4 px-4 ${semantic.textSecondary}`}>{student.lastInterviewDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-8`}>
        <h2 className={`text-2xl font-bold ${semantic.textPrimary} mb-6`}>Recent Notes</h2>
        
        {advisor.recentNotes.length === 0 ? (
          <div className={`text-center py-12 ${semantic.textTertiary}`}>
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>No recent notes available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {advisor.recentNotes.map((note) => (
              <div key={note.id} className={`border ${semantic.borderMedium} rounded-xl p-5 hover:border-[#C8A0FE]/30 transition-colors`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-semibold ${semantic.textPrimary} mb-1`}>{note.studentName}</h3>
                    <p className={`text-sm ${semantic.textSecondary}`}>{note.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
