import { semantic, shadows } from '../../utils/colors';

interface ReadinessBreakdownProps {
  competencies: {
    Communication: number;
    'Problem Solving': number;
    Technical: number;
    Confidence: number;
    Clarity: number;
  };
}

export function ReadinessBreakdown({ competencies }: ReadinessBreakdownProps) {
  const getColor = (value: number) => {
    if (value >= 80) return 'from-[#C8A0FE] to-[#B8CCF4]';
    if (value >= 70) return 'from-[#B8CCF4] to-[#102c64]';
    return 'from-[#FE686D] to-[#ff9a9e]';
  };

  const entries = Object.entries(competencies);

  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-6`}>
      <h3 className={`text-lg font-semibold ${semantic.textPrimary} mb-6`}>Readiness Breakdown</h3>
      
      <div className="space-y-4">
        {entries.map(([name, value]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${semantic.textSecondary}`}>{name}</span>
              <span className={`text-sm font-bold ${semantic.textPrimary}`}>{value}</span>
            </div>
            <div className={`h-3 ${semantic.bgSubtle} rounded-full overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r ${getColor(value)} transition-all duration-500 rounded-full`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
