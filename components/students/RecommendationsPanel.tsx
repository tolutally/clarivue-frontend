import { ClipboardList, Users, Calendar } from 'lucide-react';
import { semantic, shadows, gradients } from '../../utils/colors';
import type { Recommendation } from '../../types';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const iconMap = {
  clipboard: ClipboardList,
  users: Users,
  calendar: Calendar,
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-6`}>
      <h3 className={`text-lg font-semibold ${semantic.textPrimary} mb-6`}>Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = iconMap[rec.icon as keyof typeof iconMap];
          
          return (
            <div 
              key={rec.id}
              className={`p-4 bg-gradient-to-r from-[#102c64]/5 to-[#B8CCF4]/10 rounded-xl border ${semantic.border} hover:border-[#102c64]/30 transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients.tertiary} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${semantic.textPrimary} mb-1`}>{rec.title}</h4>
                  <p className={`text-sm ${semantic.textSecondary}`}>{rec.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
