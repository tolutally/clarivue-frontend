import { Users, FileText, Clock, MessageSquare } from 'lucide-react';
import type { Advisor } from '../../types';
import { backgrounds, gradients, semantic, shadows } from '../../utils/colors';

interface AdvisorCardProps {
  advisor: Advisor;
  onClick: () => void;
}

export function AdvisorCard({ advisor, onClick }: AdvisorCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${semantic.surface} rounded-xl ${shadows.sm} border ${semantic.border} p-6 ${shadows.md} transition-all cursor-pointer hover:border-[#C8A0FE]/30`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-white text-xl font-semibold`}>
            {advisor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>{advisor.name}</h3>
            <p className={`text-sm ${semantic.textSecondary}`}>{advisor.title}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 ${backgrounds.primaryLight} text-[#102C64] rounded-full text-sm font-medium`}>
          <Users size={14} />
          <span>{advisor.activityMetrics.activeStudents}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
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
              className={`px-2 py-1 ${bgColor} ${textColor} rounded-md text-xs font-medium`}
            >
              {spec}
            </span>
          );
        })}
      </div>

      <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${semantic.border}`}>
        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 ${semantic.textTertiary} mb-1`}>
            <FileText size={14} />
          </div>
          <div className={`text-xl font-semibold ${semantic.textPrimary}`}>{advisor.activityMetrics.totalNotes}</div>
          <div className={`text-xs ${semantic.textSecondary}`}>Notes</div>
        </div>
        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 ${semantic.textTertiary} mb-1`}>
            <MessageSquare size={14} />
          </div>
          <div className={`text-xl font-semibold ${semantic.textPrimary}`}>{advisor.activityMetrics.reviewsCompleted}</div>
          <div className={`text-xs ${semantic.textSecondary}`}>Reviews</div>
        </div>
        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 ${semantic.textTertiary} mb-1`}>
            <Clock size={14} />
          </div>
          <div className={`text-xl font-semibold ${semantic.textPrimary}`}>{advisor.activityMetrics.avgResponseTime}h</div>
          <div className={`text-xs ${semantic.textSecondary}`}>Avg Time</div>
        </div>
      </div>
    </div>
  );
}
