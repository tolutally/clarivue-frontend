import { Activity, Users, TrendingUp, Clock } from 'lucide-react';
import { semantic, shadows } from '../utils/colors';
import type { Student } from '../types';

interface AnalyticsSummaryProps {
  students: Student[];
}

const metrics = [
  { icon: Activity, label: 'Total Mock Interviews', value: '248' },
  { icon: Users, label: 'Active Students', value: '186' },
  { icon: TrendingUp, label: 'Avg Improvement', value: '+17.4 pts' },
  { icon: Clock, label: 'Avg Interview Length', value: '22.5 min' },
];

export function AnalyticsSummary({ students }: AnalyticsSummaryProps) {
  return (
    <div className={`${semantic.surface} rounded-xl border ${semantic.borderMedium} ${shadows.sm}`}>
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fe686d] to-[#ff9a9d] flex items-center justify-center">
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#001223]">{metric.value}</p>
                <p className={`text-xs ${semantic.textTertiary}`}>{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
